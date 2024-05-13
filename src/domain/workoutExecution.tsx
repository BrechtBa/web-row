import  { Workout }  from './workout'
import  { User }  from './user'
import { TimeDelta } from './intensityZone';


export interface WorkoutResult {
  distance: number;
  time: TimeDelta;
  score: number;
}


export interface MeteorWorkoutResult {
  distance: number;
  time: TimeDelta;
  score: number;
  targets: number;
}



export class WorkoutExecution<Type> {

  workoutExecutionId: string;
  workout: Workout;
  user: User;
  result: Type;

  constructor(workoutExecutionId: string, workout: Workout, user: User, result: Type) {
    this.workoutExecutionId = workoutExecutionId;
    this.workout = workout;
    this.user = user;
    this.result = result;
  }

  static createMeteorWorkout(workout: Workout, user: User, result: MeteorWorkoutResult): WorkoutExecution<MeteorWorkoutResult>{
    return new WorkoutExecution(crypto.randomUUID(), workout, user, result)
  }
}

export type WorkoutVelocityHistory = Array<{time: TimeDelta, velocity: number}>;
