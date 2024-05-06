
import { IntensityZone, TimeDelta } from '@/domain/intensityZone'
import { MeteorWorkoutIntervalDefinition, MeteorWorkoutDefinition, MeteorWorkoutTargetDefinition } from '@/domain/meteor'
import MeteorWorkoutRepository from './interface'


const workouts = [
  new MeteorWorkoutDefinition("workout1", "Amazing workout", "test",[
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
  ]),
  new MeteorWorkoutDefinition("workout2", "Another workout", "test", [
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
  ]),
  new MeteorWorkoutDefinition("workout3", "Yet another workout", "test", [
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
]


export default class MockMeteorWorkoutRepository implements MeteorWorkoutRepository {

  listWorkouts(): Array<MeteorWorkoutDefinition>{
    return workouts;
  }
  
  getWorkout(workoutId: string): MeteorWorkoutDefinition | undefined {
    const filteredWorkouts = workouts.filter((w) => w.workoutId === workoutId);
    return filteredWorkouts[0];
  }

}