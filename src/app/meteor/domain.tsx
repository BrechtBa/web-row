
import { IntensityZone, IntensityZoneSplits } from '../../domain/domain.tsx'

import IRower from '../../rower/interface.tsx'


export class MeteorWorkoutDefSegment {
  constructor (duration: number, intensityZone: IntensityZone) {
    this.duration = duration;
    this.intensityZone = intensityZone;
  }

  getMeteorDistance(): number {
    return getMeteorVelocity(this.intensityZone) * this.duration / 1000;
  }

}


export class MeteorWorkoutDef {
  constructor(segments: Array<MeteorWorkoutDefSegment>) {
    this.segments = segments;
  }

  getTotalDuration() : number {
    return this.segments.reduce((accumulator, segment) => accumulator + segment.duration, 0);
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
  if(zone === IntensityZone.Sprint){
    // there is no upper bound, so return the same width as the previous zone
    const v1 = 500*1000 / intensityZoneSplits[zone]
    const v0 = 500*1000 / intensityZoneSplits[zone-1]
    return {min: v1, max: v1 + (v1-v0)}
  }
  return {min: 500*1000 / intensityZoneSplits[zone], max: 500*1000 / intensityZoneSplits[zone+1]};
}


export class MeteorWorkoutSegment {
  constructor(segment: MeteorWorkoutDefSegment, previousSegment: MeteorWorkoutSegment, intensityZoneSplits: IntensityZoneSplits){
    this.segment = segment;
    this.previousSegment = previousSegment;
    this.intensityZoneSplits = intensityZoneSplits;

    this.intensityZone = segment.intensityZone;
    this.duration = segment.duration;
    this.meteorVelocity = getMeteorVelocity(segment.intensityZone);
    this.meteorDistance = this.meteorVelocity * this.duration / 1000;
    this.meteorBounds = getIntensityZoneInstantaneousVelocityBounds(this.intensityZone, this.intensityZoneSplits)

    if(previousSegment === null || previousSegment === undefined){
      this.startTime = 0;
      this.startDistance = 0;
    }
    else {
      this.startTime = previousSegment.startTime + previousSegment.duration;
      this.startDistance = previousSegment.startDistance + previousSegment.meteorDistance;
    }
  }
}

export class MeteorWorkout {
  constructor(workout: MeteorWorkoutDef, intensityZoneSplits: IntensityZoneSplits) {
    this.workout = workout;
    this.intensityZoneSplits = intensityZoneSplits;
    this.segments = this._makeSegments(workout, intensityZoneSplits);

    this.totalDuration = this.workout.getTotalDuration()

    this.startDate = null;

    this.active = false;
    this.instantaneousVelocity = 0;

    this.activeSegment = null;

    this.meteorVelocity = getMeteorVelocity();  // not actual rower velocity but the velocity of the meteor
    this.meteorDistance = 0;  // not actual rower distance but used for displaying grid lines

    this.meteorTrace = [[0, this.instantaneousVelocity]];

    this.history = [[0, 0]]

    this.meteorBoundsTrace = this._getWorkoutInstantaneousVelocityBoundsTrace(
      this.segments, getIntensityZoneInstantaneousVelocityBounds(IntensityZone.Paddle, intensityZoneSplits)
    );
    this.meteorVelocityMin = getIntensityZoneInstantaneousVelocityBounds(IntensityZone.Paddle, intensityZoneSplits).min;
    this.meteorVelocityMax = getIntensityZoneInstantaneousVelocityBounds(IntensityZone.Sprint, intensityZoneSplits).max;
  }

  _makeSegments(workout: MeteorWorkoutDef, intensityZoneSplits: IntensityZoneSplits): Array<MeteorWorkoutSegment> {
    return workout.segments.map((segment, index) => {
      return new MeteorWorkoutSegment(segment, workout.segments[index-1], intensityZoneSplits)
    });
  }

  start() {
    this.active = true;
    this.startDate = new Date();
  }

  update(now: Date, rower: IRower) {

    this.instantaneousVelocity = rower.getInstantaneousVelocity();

    if(this.active){
      const time = now.getTime() - this.startDate.getTime()

      this.meteorDistance = this._getMeteorDistance(time)
      this.activeSegment = this._getActiveSegment(time);

      if(this.activeSegment !== null) {
        this.meteorVelocity = getMeteorVelocity(this.activeSegment.intensityZone)
      }
      else{
        this.meteorVelocity = getMeteorVelocity()
      }

      // update meteor trace
      if(this.meteorDistance - this.meteorTrace[this.meteorTrace.length-1][0] > 0.2){
        this.meteorTrace.push([this.meteorDistance, this.instantaneousVelocity]);
        this.meteorTrace = this.meteorTrace.slice(-40);
      }

      // update history
      const relativeTime = now.getTime() - this.startDate.getTime();
      if(relativeTime - this.history[this.history.length-1] > 1.){
        this.history.push([relativeTime, this.instantaneousVelocity])
      }
    }
  }

  _getMeteorDistance(time: number): number {
    let totalDuration = 0;
    let totalDistance = 0;
    let segment = null;
    for (var i = 0; i < this.segments.length; i +=1) {
      segment = this.segments[i];
      if(totalDuration + segment.duration > time) {
        totalDistance += (time - totalDuration) / 1000 * segment.meteorVelocity;
        return totalDistance;
      }
      totalDuration += segment.duration
      totalDistance += segment.duration / 1000 * segment.meteorVelocity;
    }
    return totalDistance + (time - totalDuration) / 1000 * getMeteorVelocity(IntensityZone.Paddle);
  }

  _getActiveSegment(time: number): MeteorWorkoutDefSegment {

    let segmentStart = 0;
    for (var i = 0; i < this.segments.length; i +=1) {
      if (time < segmentStart + this.segments[i].duration) {
        return this.segments[i];
      }
      segmentStart += this.segments[i].duration;
    }
    return null;
  }

  _getSegmentInstantaneousVelocityBoundsTrace(segment: MeteorWorkoutSegment, previousBounds: {min: number, max: number}, startDistance) {
    const meteorVelocity = segment.meteorVelocity;
    const newBounds = segment.meteorBounds;

    let distance = 0;
    let min = previousBounds.min;
    let max = previousBounds.max;
    let v = 0;

    const delta = 10;

    let bounds = []
    for (var t = 0; t < segment.duration; t += 200) {
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
      bounds.push([distance + startDistance, {min: min, max: max}])
    }
    return bounds;
  }

  _getWorkoutInstantaneousVelocityBoundsTrace(segments: Array<MeteorWorkoutSegment>, previousBounds) {
    let segmentStartDistance = 0;

    let bounds = [[-20, previousBounds]];
    for (var i = 0; i < segments.length; i += 1) {
      bounds = bounds.concat(
        this._getSegmentInstantaneousVelocityBoundsTrace(segments[i], bounds[bounds.length - 1][1], segmentStartDistance)
      );
      segmentStartDistance += segments[i].meteorDistance;
    }
    for (var i=1; i < 20; i+= 1){
      bounds.push([bounds[bounds.length - 1][0] + 20, bounds[bounds.length - 1][1]])
    }

    return bounds;
  }
}
