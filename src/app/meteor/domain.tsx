
import { IntensityZone, IntensityZoneSplits, TimeDelta } from '../../domain/domain'

import Rower from '../../rower/interface'


export class MeteorWorkoutDefSegment {

  duration: TimeDelta;
  intensityZone: IntensityZone;

  constructor (duration: TimeDelta, intensityZone: IntensityZone) {
    this.duration = duration;
    this.intensityZone = intensityZone;
  }

  getMeteorDistance(): number {
    return getMeteorVelocity(this.intensityZone) * this.duration.timeDeltaMs / 1000;
  }

}


export class MeteorWorkoutDef {
  segments: MeteorWorkoutDefSegment[];

  constructor(segments: Array<MeteorWorkoutDefSegment>) {
    this.segments = segments;
  }

  getTotalDuration() : TimeDelta {
    return new TimeDelta(this.segments.reduce((accumulator, segment) => accumulator + segment.duration.timeDeltaMs, 0));
  }

  getSegments(): Array<MeteorWorkoutDefSegment> {
    return this.segments;
  }
}


function getMeteorVelocity(zone?: IntensityZone) {
  if( zone === IntensityZone.Steady) {
   return 3.5;
  }
  else if( zone === IntensityZone.Race) {
   return 4.0;
  }
  else if( zone === IntensityZone.Sprint) {
   return 4.5;
  }
  else {
   return 3.0;
  }
}


export function getIntensityZoneInstantaneousVelocityBounds(zone: IntensityZone, intensityZoneSplits: IntensityZoneSplits): {min: number, max: number} {

  let splitMin = intensityZoneSplits[zone];
  let splitMax = 0;

  if(zone === IntensityZone.Paddle){
    splitMax = intensityZoneSplits[IntensityZone.Steady];
  }
  if(zone === IntensityZone.Steady){
    splitMax = intensityZoneSplits[IntensityZone.Race];
  }
  if(zone === IntensityZone.Race){
    splitMax = intensityZoneSplits[IntensityZone.Sprint];
  }
  if(zone === IntensityZone.Sprint){
    // there is no upper bound, so return the same width as the previous zone
    const v1 = 500*1000 / splitMin
    const v0 = 500*1000 / intensityZoneSplits[IntensityZone.Race]
    return {min: v1, max: v1 + (v1-v0)}
  }

  return {min: 500*1000 / splitMin, max: 500*1000 / splitMax};
}

interface ActiveSegmentData {
  index: number;
  duration: TimeDelta;
  timeRemaining: TimeDelta;
}


interface MeteorData {
  meteorDistance: number;
  meteorTrace: Array<Array<number>>;
  instantaneousVelocity: number;
  duration: TimeDelta;
  time: TimeDelta;
  timeRemaining: TimeDelta;
  totalSegments: number;
  activeSegment: ActiveSegmentData;
}


export class MeteorWorkoutSegment {

  segment: MeteorWorkoutDefSegment;
  previousSegment: MeteorWorkoutSegment | null;
  intensityZoneSplits: IntensityZoneSplits;
  intensityZone: IntensityZone;
  startTime: TimeDelta
  duration: TimeDelta;
  meteorVelocity: number;
  meteorDistance: number;
  meteorStartDistance: number;
  meteorBounds: {min: number, max: number};

  constructor(segment: MeteorWorkoutDefSegment, previousSegment: MeteorWorkoutSegment, intensityZoneSplits: IntensityZoneSplits){
    this.segment = segment;
    this.previousSegment = previousSegment;
    this.intensityZoneSplits = intensityZoneSplits;

    this.intensityZone = segment.intensityZone;
    this.duration = segment.duration;
    this.meteorVelocity = getMeteorVelocity(segment.intensityZone);
    this.meteorDistance = this.meteorVelocity * this.duration.timeDeltaMs / 1000;
    this.meteorBounds = getIntensityZoneInstantaneousVelocityBounds(this.intensityZone, this.intensityZoneSplits)

    if(previousSegment === null || previousSegment === undefined){
      this.startTime = new TimeDelta(0);
      this.meteorStartDistance = 0;
    }
    else {
      this.startTime = new TimeDelta(previousSegment.startTime.timeDeltaMs + previousSegment.duration.timeDeltaMs);
      this.meteorStartDistance = previousSegment.meteorStartDistance + previousSegment.meteorDistance;
    }
  }
}

export class MeteorWorkout {
  workout: MeteorWorkoutDef;
  intensityZoneSplits: IntensityZoneSplits;
  segments: Array<MeteorWorkoutSegment>;

  totalDuration: TimeDelta;
  meteorVelocityMin: number;
  meteorVelocityMax: number;
  meteorBoundsTrace: Array<{distance: number, min: number, max: number}>;

  startDate: Date | null;
  meteorTrace: Array<Array<number>>;
  meteorHistory: Array<{time: TimeDelta, velocity: number}>;

  constructor(workout: MeteorWorkoutDef, intensityZoneSplits: IntensityZoneSplits) {
    this.workout = workout;
    this.intensityZoneSplits = intensityZoneSplits;
    this.segments = this._makeSegments(workout, intensityZoneSplits);

    this.totalDuration = this.workout.getTotalDuration()

    this.startDate = null;

    this.meteorTrace = [[0, 0]];
    this.meteorHistory = [{time: new TimeDelta(0), velocity: 0}]

    this.meteorBoundsTrace = this._getWorkoutInstantaneousVelocityBoundsTrace(
      this.segments, getIntensityZoneInstantaneousVelocityBounds(IntensityZone.Paddle, intensityZoneSplits)
    );
    this.meteorVelocityMin = getIntensityZoneInstantaneousVelocityBounds(IntensityZone.Paddle, intensityZoneSplits).min;
    this.meteorVelocityMax = getIntensityZoneInstantaneousVelocityBounds(IntensityZone.Sprint, intensityZoneSplits).max;
  }

  getInitialData(): MeteorData {
    return {
      meteorDistance: 0,
      meteorTrace: [[0, 0]],
      instantaneousVelocity: 0,
      duration: new TimeDelta(0),
      time: new TimeDelta(0),
      timeRemaining: new TimeDelta(0),
      totalSegments: 0,
      activeSegment: {
        index: -1,
        duration: new TimeDelta(0),
        timeRemaining: new TimeDelta(0),
      }
    }

  }

  start() {
    this.startDate = new Date();
  }

  update(now: Date, rower: Rower): MeteorData {

    let instantaneousVelocity = rower.getInstantaneousVelocity();
    let time = new TimeDelta(0);
    let activeSegmentIndex = -1;
    let activeSegment = null;
    let meteorVelocity = 0;
    let meteorDistance = 0;

    if(this.startDate !== null){
      time = new TimeDelta(now.getTime() - this.startDate.getTime());

      meteorDistance = this._getMeteorDistance(time)
      activeSegmentIndex = this._getActiveSegmentIndex(time);

      if(activeSegmentIndex >= 0) {
        activeSegment = this.segments[activeSegmentIndex];
        meteorVelocity = getMeteorVelocity(activeSegment.intensityZone)
      }
      else {
        meteorVelocity = getMeteorVelocity()
      }

      // update meteor trace
      if(meteorDistance - this.meteorTrace[this.meteorTrace.length-1][0] > 0.2){
        this.meteorTrace.push([meteorDistance, instantaneousVelocity]);
        this.meteorTrace = this.meteorTrace.slice(-40);
      }

      // update history
      if(time.timeDeltaMs - this.meteorHistory[this.meteorHistory.length-1].time.timeDeltaMs > 1.){
        this.meteorHistory.push({time: time, velocity: instantaneousVelocity})
      }
    }

    return {
      meteorDistance: meteorDistance,
      instantaneousVelocity: instantaneousVelocity,
      meteorTrace: this.meteorTrace,
      duration: this.totalDuration,
      time: time,
      timeRemaining: this.totalDuration.subtract(time),
      totalSegments: this.workout.segments.length,
      activeSegment: {
        index: activeSegmentIndex,
        duration: activeSegment !== null ? activeSegment.duration : new TimeDelta(0),
        timeRemaining: activeSegment !== null ? activeSegment.startTime.add(activeSegment.duration).subtract(time) : new TimeDelta(0),
      }
    };
  }

  _makeSegments(workout: MeteorWorkoutDef, intensityZoneSplits: IntensityZoneSplits): Array<MeteorWorkoutSegment> {
    let segments: Array<MeteorWorkoutSegment> = [];
    for (var i = 0; i < workout.segments.length; i +=1) {
      segments.push(new MeteorWorkoutSegment(workout.segments[i], segments[segments.length-1], intensityZoneSplits))
    }
    return segments
  }

  _getMeteorDistance(time: TimeDelta): number {
    let totalDuration = 0;
    let totalDistance = 0;
    let segment = null;
    for (var i = 0; i < this.segments.length; i +=1) {
      segment = this.segments[i];
      if(totalDuration + segment.duration.timeDeltaMs > time.timeDeltaMs) {
        totalDistance += (time.timeDeltaMs - totalDuration) / 1000 * segment.meteorVelocity;
        return totalDistance;
      }
      totalDuration += segment.duration.timeDeltaMs
      totalDistance += segment.duration.timeDeltaMs / 1000 * segment.meteorVelocity;
    }
    return totalDistance + (time.timeDeltaMs - totalDuration) / 1000 * getMeteorVelocity(IntensityZone.Paddle);
  }

  _getActiveSegmentIndex(time: TimeDelta): number {

    let segmentStart = 0;
    for (var i = 0; i < this.segments.length; i +=1) {
      if (time.timeDeltaMs < segmentStart + this.segments[i].duration.timeDeltaMs) {
        return i;
      }
      segmentStart += this.segments[i].duration.timeDeltaMs;
    }
    return -1;
  }

  _getWorkoutInstantaneousVelocityBoundsTrace(segments: MeteorWorkoutSegment[], previousBounds: {min: number, max: number}): {distance: number, min: number, max: number}[] {
    let segmentStartDistance = 0;

    let bounds = [{distance: 0, ...previousBounds}];
    for (var i = 0; i < segments.length; i += 1) {
      bounds = bounds.concat(
        this._getSegmentInstantaneousVelocityBoundsTrace(segments[i], {min: bounds[bounds.length - 1].min, max: bounds[bounds.length - 1].max}, segmentStartDistance)
      );
      segmentStartDistance += segments[i].meteorDistance;
    }

    // bounds = bounds.concat(
    //   Array.from({length: 20}, (_, i) => i + 1).map((i) => {
    //     return {
    //       distance: bounds[bounds.length - 1].distance + i*20,
    //       min: bounds[bounds.length - 1].min,
    //       max: bounds[bounds.length - 1].max,
    //     };
    //   })
    // );
    // console.log(bounds);
    
    return bounds;
  }

  _getSegmentInstantaneousVelocityBoundsTrace(segment: MeteorWorkoutSegment, previousBounds: {min: number, max: number}, startDistance: number): {distance: number, min: number, max: number}[] {
    const meteorVelocity = segment.meteorVelocity;
    const newBounds = segment.meteorBounds;

    let distance = 0;
    let min = previousBounds.min;
    let max = previousBounds.max;
    let v = 0;

    const delta = 20;

    let bounds = []
    for (var t = 0; t < segment.duration.timeDeltaMs; t += 200) {
      distance = meteorVelocity * t / 1000

      if( distance < delta ) {
        v = 0.5 - 0.5*Math.cos(Math.PI * distance / delta);
        min = previousBounds.min + v * (newBounds.min - previousBounds.min);
        max = previousBounds.max + v * (newBounds.max - previousBounds.max);
      }
      else {
        min = newBounds.min;
        max = newBounds.max;
      }
      bounds.push({distance: distance + startDistance, min: min, max: max})
    }
    return bounds;
  }
}
