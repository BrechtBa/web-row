
import { MeteorWorkout } from '@/domain/meteor'
import { WorkoutExecution, MeteorWorkoutResult } from '@/domain/workoutExecution';



export interface MeteorWorkoutRepository {

  listWorkouts(limit?: number, offset? : number): Promise<Array<MeteorWorkout>>;

  getWorkoutByWorkoutId(workoutId: string): Promise<MeteorWorkout | undefined>;

  storeWorkout(workout: MeteorWorkout): void;

}

export interface MeteorWorkoutExecutionRepository {

  listWorkoutExecutionsForWorkoutSortedByScore(workoutId: string, limit?: number): Promise<Array<WorkoutExecution<MeteorWorkoutResult>>>;

  storeWorkoutExecution(workoutExecution: WorkoutExecution<MeteorWorkoutResult>): void;
}
