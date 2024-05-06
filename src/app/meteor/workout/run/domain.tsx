
import { IntensityZone, IntensityZoneSplits, TimeDelta } from '../../../../domain/intensityZone'
import { MeteorWorkoutIntervalDefinition, MeteorWorkoutDefinition } from '../../../../domain/meteor'
import Rower from '../../../../rower/interface'


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

export interface ActiveSegmentData {
  index: number;
  duration: TimeDelta;
  timeRemaining: TimeDelta;
}


export interface MeteorData {
  frameRate: number;
  meteorDistance: number;
  meteorTrace: Array<Array<number>>;
  instantaneousVelocity: number;
  duration: TimeDelta;
  time: TimeDelta;
  timeRemaining: TimeDelta;
  totalSegments: number;
  activeSegment: ActiveSegmentData;
  targets: Array<MeteorWorkoutTarget>;
  targetsCaught: number;
  score: number;
}


export class MeteorWorkoutSegment {

  segment: MeteorWorkoutIntervalDefinition;
  previousSegment: MeteorWorkoutSegment | null;
  intensityZoneSplits: IntensityZoneSplits;
  intensityZone: IntensityZone;
  startTime: TimeDelta
  duration: TimeDelta;
  meteorVelocity: number;
  meteorDistance: number;
  meteorStartDistance: number;
  meteorBounds: {min: number, max: number};

  constructor(segment: MeteorWorkoutIntervalDefinition, previousSegment: MeteorWorkoutSegment, intensityZoneSplits: IntensityZoneSplits){
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

  getTimeDeltaMeteorDistance(timeDelta: TimeDelta): number {
    return getMeteorVelocity(this.intensityZone) * timeDelta.timeDeltaMs / 1000;
  }


  getMeteorDistance(): number {
    return this.getTimeDeltaMeteorDistance(this.duration)
  }
}


export class MeteorWorkoutTarget {
  meteorDistance: number;
  meteorVelocityBounds: {min: number, max: number};
  meteorVelocity: number;
  points: number;
  caught: boolean;

  constructor(meteorDistance: number, meteorVelocityBounds: {min: number, max: number}, points: number) {
    this.meteorDistance = meteorDistance;
    this.meteorVelocityBounds = meteorVelocityBounds;
    this.meteorVelocity = 0.5*meteorVelocityBounds.min + 0.5*meteorVelocityBounds.max;
    this.points = points;
    this.caught = false;
  }

}

export class MeteorWorkout {
  workout: MeteorWorkoutDefinition;
  intensityZoneSplits: IntensityZoneSplits;
  segments: Array<MeteorWorkoutSegment>;

  totalDuration: TimeDelta;
  meteorVelocityMin: number;
  meteorVelocityMax: number;
  meteorBoundsTrace: Array<{distance: number, min: number, max: number}>;
  targets: Array<MeteorWorkoutTarget>;

  startDate: Date | null;
  lastUpdateDate: Date;
  meteorTrace: Array<Array<number>>;
  meteorHistory: Array<{time: TimeDelta, velocity: number}>;

  constructor(workout: MeteorWorkoutDefinition, intensityZoneSplits: IntensityZoneSplits) {
    this.workout = workout;
    this.intensityZoneSplits = intensityZoneSplits;
    this.segments = this._makeSegments(workout, intensityZoneSplits);

    this.totalDuration = this.workout.getTotalDuration()

    this.startDate = null;
    this.lastUpdateDate = new Date();

    this.meteorTrace = [[0, 0]];
    this.meteorHistory = [{time: new TimeDelta(0), velocity: 0}]

    this.meteorBoundsTrace = this._getWorkoutInstantaneousVelocityBoundsTrace(
      this.segments, getIntensityZoneInstantaneousVelocityBounds(IntensityZone.Paddle, intensityZoneSplits)
    );
    this.meteorVelocityMin = getIntensityZoneInstantaneousVelocityBounds(IntensityZone.Paddle, intensityZoneSplits).min;
    this.meteorVelocityMax = getIntensityZoneInstantaneousVelocityBounds(IntensityZone.Sprint, intensityZoneSplits).max;
    this.targets = this._getTargets(this.segments);

  }

  static getInitialData(): MeteorData {
    return {
      frameRate: 0,
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
      },
      targets: [],
      targetsCaught: 0,
      score: 0,
    }

  }

  start() {
    this.startDate = new Date();
    this.meteorTrace = [[0, 0]];
    this.meteorHistory = [{time: new TimeDelta(0), velocity: 0}];
    this.segments = this._makeSegments(this.workout, this.intensityZoneSplits);
    this.targets = this._getTargets(this.segments);
  }

  update(now: Date, rower: Rower): MeteorData {

    let instantaneousVelocity = rower.getInstantaneousVelocity();
    let time = new TimeDelta(0);
    let activeSegmentIndex = -1;
    let activeSegment = null;
    let meteorVelocity = 0;
    let meteorDistance = 0;

    let frameRate = 1000/(now.getTime() - this.lastUpdateDate.getTime())
    this.lastUpdateDate = now;

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

      // update targets
      this.targets.filter(target => !target.caught).forEach(target => {
        if(this._checkTargetCaught(target, meteorDistance, instantaneousVelocity)) {
          target.caught = true;
        }
      });

      // update meteor trace
      if(meteorDistance - this.meteorTrace[this.meteorTrace.length-1][0] > 0.5){
        this.meteorTrace.push([meteorDistance, instantaneousVelocity]);
        this.meteorTrace = this.meteorTrace.filter(v => v[0] > meteorDistance - 10);
      }

      // update history
      if(time.timeDeltaMs - this.meteorHistory[this.meteorHistory.length-1].time.timeDeltaMs > 1.){
        this.meteorHistory.push({time: time, velocity: instantaneousVelocity})
      }
    }

    let targetsCaught = this.targets.filter(target => target.caught).length
    let score = this.targets.reduce((accumulator: number, target: MeteorWorkoutTarget) => accumulator + (target.caught ? target.points : 0), 0)

    return {
      frameRate: frameRate,
      meteorDistance: meteorDistance,
      instantaneousVelocity: instantaneousVelocity,
      meteorTrace: this.meteorTrace,
      duration: this.totalDuration,
      time: time,
      timeRemaining: new TimeDelta(Math.max(0, this.totalDuration.timeDeltaMs - time.timeDeltaMs)),
      totalSegments: this.workout.segments.length,
      activeSegment: {
        index: activeSegmentIndex,
        duration: activeSegment !== null ? activeSegment.duration : new TimeDelta(0),
        timeRemaining: activeSegment !== null ? new TimeDelta(Math.max(0, activeSegment.startTime.timeDeltaMs + activeSegment.duration.timeDeltaMs - time.timeDeltaMs)) : new TimeDelta(0),
      },
      targets: this.targets,
      targetsCaught: targetsCaught,
      score: score,
    };
  }

  _makeSegments(workout: MeteorWorkoutDefinition, intensityZoneSplits: IntensityZoneSplits): Array<MeteorWorkoutSegment> {
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
    
    return bounds;
  }

  _getSegmentInstantaneousVelocityBoundsTrace(segment: MeteorWorkoutSegment, previousBounds: {min: number, max: number}, startDistance: number): {distance: number, min: number, max: number}[] {
    const meteorVelocity = segment.meteorVelocity;
    const newBounds = segment.meteorBounds;

    let distance = 0;
    let min = previousBounds.min;
    let max = previousBounds.max;
    let v = 0;

    const transferTime = 5;
    let transferDistance = 0;

    let bounds = []
    for (var t = 0; t < segment.duration.timeDeltaMs; t += 200) {
      distance = meteorVelocity * t / 1000
      transferDistance =  meteorVelocity * transferTime;

      if( distance < transferDistance ) {
        v = 0.5 - 0.5*Math.cos(Math.PI * distance / transferDistance);
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

  _getTargets(segments: Array<MeteorWorkoutSegment>): Array<MeteorWorkoutTarget> {
    let targets: Array<MeteorWorkoutTarget> = [];
    for(var i = 0; i < segments.length; i += 1) {
      let velocityBounds = getIntensityZoneInstantaneousVelocityBounds(segments[i].intensityZone, this.intensityZoneSplits)
      
      let newTargets: Array<MeteorWorkoutTarget> = segments[i].segment.targets.map(target => new MeteorWorkoutTarget(
        segments[i].meteorStartDistance + segments[i].getTimeDeltaMeteorDistance(target.time),
        velocityBounds,
        target.target.points
      ))

      targets = targets.concat(newTargets)
    }
    return targets;
  }

  _checkTargetCaught(target: MeteorWorkoutTarget, meteorDistance: number, meteorVelocity: number){
    return Math.abs(target.meteorDistance - meteorDistance) < 0.5 && 
      meteorVelocity >= target.meteorVelocityBounds.min && 
      meteorVelocity < target.meteorVelocityBounds.max;
  }
}
