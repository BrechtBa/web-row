import { IntensityZone, TimeDelta } from '../../domain/domain'


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
  workoutId: string
  title: string
  description: string
  segments: MeteorWorkoutIntervalDefinition[];

  constructor(workoutId: string, title: string, description: string, segments: Array<MeteorWorkoutIntervalDefinition>) {
    this.workoutId = workoutId
    this.title = title
    this.description = description
    this.segments = segments;
  }

  getTotalDuration() : TimeDelta {
    return new TimeDelta(this.segments.reduce((accumulator, segment) => accumulator + segment.duration.timeDeltaMs, 0));
  }

  getSegments(): Array<MeteorWorkoutIntervalDefinition> {
    return this.segments;
  }
}