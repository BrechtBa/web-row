import { MeteorWorkoutResult, WorkoutExecution } from '@/domain/workoutExecution';



export default interface MeteorWorkoutExecutionRepository {

  listWorkoutExecutionsForWorkoutSortedByScore(workoutId: string, limit?: number): Promise<Array<WorkoutExecution<MeteorWorkoutResult>>>;

  storeWorkoutExecution(workoutExecution: WorkoutExecution<MeteorWorkoutResult>): void;
}