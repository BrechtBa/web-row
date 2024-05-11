import { WorkoutExecution } from '@/domain/workoutExecution';



export default interface WorkoutExecutionRepository {

  listWorkoutExecutionsForWorkoutSortedByScore(workoutId: string, limit?: number): Array<WorkoutExecution>;
  
  getWorkoutExecution(workoutExecutionId: string): WorkoutExecution | undefined;

  storeWorkoutExecution(workoutExecution: WorkoutExecution): void;
}