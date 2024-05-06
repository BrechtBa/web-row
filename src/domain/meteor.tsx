import { IntensityZone, TimeDelta } from './intensityZone'
import { Workout } from './workout'


export class MeteorWorkoutTargetDefinition {
  points: number

  constructor(points: number){
    this.points = points;
  }
}
  
  
export class MeteorWorkoutIntervalDefinition {

  duration: TimeDelta;
  intensityZone: IntensityZone;
  targets: Array<{time: TimeDelta, target: MeteorWorkoutTargetDefinition}>

  constructor (duration: TimeDelta, intensityZone: IntensityZone, targets: Array<{time: TimeDelta, target: MeteorWorkoutTargetDefinition}>) {
    this.duration = duration;
    this.intensityZone = intensityZone;
    this.targets = targets;
  }
}


export class MeteorWorkoutDefinition {
  segments: Array<MeteorWorkoutIntervalDefinition>;

  constructor(segments: Array<MeteorWorkoutIntervalDefinition>) {
    this.segments = segments;
  }

  getTotalDuration() : TimeDelta {
    return new TimeDelta(this.segments.reduce((accumulator, segment) => accumulator + segment.duration.timeDeltaMs, 0));
  }

  getSegments(): Array<MeteorWorkoutIntervalDefinition> {
    return this.segments;
  }
}

export class MeteorWorkoutData implements Workout {
  workoutId: string
  title: string
  description: string
  workoutDefinition: MeteorWorkoutDefinition;

  constructor(workoutId: string, title: string, description: string, workoutDefinition: MeteorWorkoutDefinition) {
    this.workoutId = workoutId
    this.title = title
    this.description = description
    this.workoutDefinition = workoutDefinition;
  }

}