
import { MeteorWorkoutDefinition } from '@/domain/meteor'



export default interface MeteorWorkoutRepository {

  listWorkouts(): Array<MeteorWorkoutDefinition>;

  getWorkout(workoutId: string): MeteorWorkoutDefinition | undefined ;

}