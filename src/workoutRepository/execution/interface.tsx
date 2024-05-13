import { MeteorWorkoutResult, WorkoutExecution } from '@/domain/workoutExecution';



export default interface MeteorWorkoutExecutionRepository {

  listWorkoutExecutionsForWorkoutSortedByScore(workoutId: string, limit?: number): Array<WorkoutExecution<MeteorWorkoutResult>>;
  
  getWorkoutExecution(workoutExecutionId: string): WorkoutExecution<MeteorWorkoutResult> | undefined;

  storeWorkoutExecution(workoutExecution: WorkoutExecution<MeteorWorkoutResult>): void;
}