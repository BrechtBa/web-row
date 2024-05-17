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

  updateIntensityZone(intensityZone: IntensityZone): MeteorWorkoutIntervalDefinition {
    return new MeteorWorkoutIntervalDefinition(this.duration, intensityZone, this.targets);
  }

  updateDuration(duration: TimeDelta): MeteorWorkoutIntervalDefinition {
    return new MeteorWorkoutIntervalDefinition(duration, this.intensityZone, this.targets);
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

  updateInterval(index: number, interval: MeteorWorkoutIntervalDefinition): MeteorWorkoutDefinition {
    let intervals = [...this.segments];
    intervals[index] = interval
    return new MeteorWorkoutDefinition(intervals);
  }

  addInterval(interval: MeteorWorkoutIntervalDefinition): MeteorWorkoutDefinition {
    let intervals = [...this.segments];
    intervals.push(interval)
    return new MeteorWorkoutDefinition(intervals);
  }
}

export class MeteorWorkout implements Workout {
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
  
  static create(title: string, description: string, workoutDefinition: MeteorWorkoutDefinition): MeteorWorkout {
    return new MeteorWorkout(crypto.randomUUID(), title, description, workoutDefinition)
  }

  updateTitle(title: string): MeteorWorkout {
    return new MeteorWorkout(this.workoutId, title, this.description, this.workoutDefinition);
  }

  updateDescription(description: string): MeteorWorkout {
    return new MeteorWorkout(this.workoutId, this.title, description, this.workoutDefinition);
  }

  updateInterval(index: number, interval: MeteorWorkoutIntervalDefinition): MeteorWorkout {
    return new MeteorWorkout(this.workoutId, this.title, this.description, this.workoutDefinition.updateInterval(index, interval));
  }

  addInterval(interval: MeteorWorkoutIntervalDefinition): MeteorWorkout {
    return new MeteorWorkout(this.workoutId, this.title, this.description, this.workoutDefinition.addInterval(interval));
  }
}