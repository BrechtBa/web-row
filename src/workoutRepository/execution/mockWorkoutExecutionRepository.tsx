import { TimeDelta, IntensityZone, IntensityZoneSplits } from "@/domain/intensityZone";
import { MeteorWorkoutData, MeteorWorkoutDefinition, MeteorWorkoutIntervalDefinition } from "@/domain/meteor";
import { Workout, WorkoutUser, Rank } from "@/domain/workout";
import { WorkoutExecution } from "@/domain/workoutExecution";

import MockMeteorWorkoutRepository from '../meteor/mockMeteorWorkoutRepository'


const workouts = new MockMeteorWorkoutRepository().listWorkouts()


const workoutUser1 = new WorkoutUser(
  "User1", {[IntensityZone.Paddle]: 400, [IntensityZone.Steady]: 300, [IntensityZone.Race]: 200, [IntensityZone.Sprint]: 100}, Rank.IV
)
const workoutUser2 = new WorkoutUser(
  "User2", {[IntensityZone.Paddle]: 400, [IntensityZone.Steady]: 300, [IntensityZone.Race]: 200, [IntensityZone.Sprint]: 100}, Rank.IV
)


const workoutExecutions: Array<WorkoutExecution> = [
  new WorkoutExecution("executionId1", workouts[0], workoutUser1, {distance: 4500, time: new TimeDelta(30*60*1000)}),
  new WorkoutExecution("executionId2", workouts[0], workoutUser1, {distance: 4500, time: new TimeDelta(32*60*1000)}),
  new WorkoutExecution("executionId3", workouts[1], workoutUser1, {distance: 4500, time: new TimeDelta(32*60*1000)}),
  new WorkoutExecution("executionId4", workouts[1], workoutUser2, {distance: 4500, time: new TimeDelta(32*60*1000)}),
]


export class MockWorkoutExecutionRepository {

  listWorkoutExecutionsForWorkout(workoutId: string): Array<WorkoutExecution>{
    return workoutExecutions.filter(execution => execution.workout.workoutId == workoutId);
  }
  
  getWorkoutExecution(workoutExecutionId: string): WorkoutExecution | undefined {
    const filteredExecutions = workoutExecutions.filter((w) => w.workoutExecutionId === workoutExecutionId);
    return filteredExecutions[0];
  }

}