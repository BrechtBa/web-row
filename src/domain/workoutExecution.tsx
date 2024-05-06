import  { Workout, WorkoutUser }  from './workout'
import { TimeDelta } from './intensityZone';


export interface WorkoutResult {
  distance: number;
  time: TimeDelta;
}


export class WorkoutExecution {

  workoutExecutionId: string;
  workout: Workout;
  user: WorkoutUser;
  result: WorkoutResult;

  constructor(workoutExecutionId: string, workout: Workout, user: WorkoutUser, result: WorkoutResult) {
    this.workoutExecutionId = workoutExecutionId;
    this.workout = workout;
    this.user = user;
    this.result = result;
  }

}