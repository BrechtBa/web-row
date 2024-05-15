import  { Workout }  from './workout'
import  { IUser }  from './user'
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
  workoutId: string;
  userId: string;
  result: Type;

  constructor(workoutExecutionId: string, workoutId: string, userId: string, result: Type) {
    this.workoutExecutionId = workoutExecutionId;
    this.workoutId = workoutId;
    this.userId = userId;
    this.result = result;
  }

  static createMeteorWorkoutExecution(workoutId: string, userId: string, result: MeteorWorkoutResult): WorkoutExecution<MeteorWorkoutResult>{
    return new WorkoutExecution(crypto.randomUUID(), workoutId, userId, result);
  }
}

export type WorkoutVelocityHistory = Array<{time: TimeDelta, velocity: number}>;
