import  { Workout }  from './workout'
import  { User }  from './user'
import { TimeDelta } from './intensityZone';


export interface WorkoutResult {
  distance: number;
  time: TimeDelta;
  score: number;
}


export class WorkoutExecution {

  workoutExecutionId: string;
  workout: Workout;
  user: User;
  result: WorkoutResult;

  constructor(workoutExecutionId: string, workout: Workout, user: User, result: WorkoutResult) {
    this.workoutExecutionId = workoutExecutionId;
    this.workout = workout;
    this.user = user;
    this.result = result;
  }

  static create(workout: Workout, user: User, result: WorkoutResult): WorkoutExecution{
    return new WorkoutExecution(crypto.randomUUID(), workout, user, result)
  }
}

export type WorkoutVelocityHistory = Array<{time: TimeDelta, velocity: number}>;
