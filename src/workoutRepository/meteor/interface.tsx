
import { MeteorWorkoutData } from '@/domain/meteor'



export default interface MeteorWorkoutRepository {

  listWorkouts(): Array<MeteorWorkoutData>;

  getWorkout(workoutId: string): MeteorWorkoutData | undefined ;

}