
import { IntensityZone, TimeDelta } from '@/domain/intensityZone'
import { MeteorWorkoutData, MeteorWorkoutIntervalDefinition, MeteorWorkoutDefinition, MeteorWorkoutTargetDefinition } from '@/domain/meteor'
import MeteorWorkoutRepository from './interface'


const workouts = [
  new MeteorWorkoutData(
    "workout1", "Amazing workout", "test",
    new MeteorWorkoutDefinition([
      new MeteorWorkoutIntervalDefinition(new TimeDelta(5*1000), IntensityZone.Paddle, [
        {time: new TimeDelta(5*1000), target: new MeteorWorkoutTargetDefinition(1)}
      ]),
      new MeteorWorkoutIntervalDefinition(new TimeDelta(10*1000), IntensityZone.Steady, [
        {time: new TimeDelta(5*1000), target: new MeteorWorkoutTargetDefinition(2)},
        {time: new TimeDelta(8*1000), target: new MeteorWorkoutTargetDefinition(2)}
      ]),
      new MeteorWorkoutIntervalDefinition(new TimeDelta(10*1000), IntensityZone.Race, [
        {time: new TimeDelta(5*1000), target: new MeteorWorkoutTargetDefinition(3)},
        {time: new TimeDelta(8*1000), target: new MeteorWorkoutTargetDefinition(3)}
      ]),
      new MeteorWorkoutIntervalDefinition(new TimeDelta(5*1000), IntensityZone.Sprint, [
        {time: new TimeDelta(5*1000), target: new MeteorWorkoutTargetDefinition(4)}
      ]),
      new MeteorWorkoutIntervalDefinition(new TimeDelta(10*1000), IntensityZone.Paddle, [
        {time: new TimeDelta(8*1000), target: new MeteorWorkoutTargetDefinition(1)}
      ]),
    ])
  ),
  new MeteorWorkoutData(
    "workout2", "Another workout", "test",
    new MeteorWorkoutDefinition([
      new MeteorWorkoutIntervalDefinition(new TimeDelta(5*1000), IntensityZone.Paddle, [
        {time: new TimeDelta(5*1000), target: new MeteorWorkoutTargetDefinition(1)}
      ]),
      new MeteorWorkoutIntervalDefinition(new TimeDelta(10*1000), IntensityZone.Steady, [
        {time: new TimeDelta(5*1000), target: new MeteorWorkoutTargetDefinition(2)},
        {time: new TimeDelta(8*1000), target: new MeteorWorkoutTargetDefinition(2)}
      ]),
      new MeteorWorkoutIntervalDefinition(new TimeDelta(10*1000), IntensityZone.Race, [
        {time: new TimeDelta(5*1000), target: new MeteorWorkoutTargetDefinition(3)},
        {time: new TimeDelta(8*1000), target: new MeteorWorkoutTargetDefinition(3)}
      ]),
      new MeteorWorkoutIntervalDefinition(new TimeDelta(5*1000), IntensityZone.Sprint, [
        {time: new TimeDelta(5*1000), target: new MeteorWorkoutTargetDefinition(4)}
      ]),
      new MeteorWorkoutIntervalDefinition(new TimeDelta(10*1000), IntensityZone.Paddle, [
        {time: new TimeDelta(8*1000), target: new MeteorWorkoutTargetDefinition(1)}
      ]),
    ])
  ),
  new MeteorWorkoutData(
    "workout3", "Very short", "test",
    new MeteorWorkoutDefinition([
      new MeteorWorkoutIntervalDefinition(new TimeDelta(1*1000), IntensityZone.Paddle, [
      ]),
      new MeteorWorkoutIntervalDefinition(new TimeDelta(1*1000), IntensityZone.Sprint, [
      ]),
    ])
  )
]


export default class MockMeteorWorkoutRepository implements MeteorWorkoutRepository {

  listWorkouts(): Array<MeteorWorkoutData>{
    return workouts;
  }
  
  getWorkout(workoutId: string): MeteorWorkoutData | undefined {
    const filteredWorkouts = workouts.filter((w) => w.workoutId === workoutId);
    return filteredWorkouts[0];
  }

}