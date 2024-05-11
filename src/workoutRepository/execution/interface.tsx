import { WorkoutExecution } from '@/domain/workoutExecution';



export default interface WorkoutExecutionRepository {

  listWorkoutExecutionsForWorkout(workoutId: string): Array<WorkoutExecution>;
  
  getWorkoutExecution(workoutExecutionId: string): WorkoutExecution | undefined;

  storeWorkoutExecution(workoutExecution: WorkoutExecution): void;
}