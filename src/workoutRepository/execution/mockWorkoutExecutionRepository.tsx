import { TimeDelta, IntensityZone, IntensityZoneSplits } from "@/domain/intensityZone";
import { MeteorWorkoutData, MeteorWorkoutDefinition, MeteorWorkoutIntervalDefinition } from "@/domain/meteor";
import { Workout } from "@/domain/workout";
import { User, Rank } from "@/domain/user";
import { WorkoutExecution } from "@/domain/workoutExecution";

import MockMeteorWorkoutRepository from '../meteor/mockMeteorWorkoutRepository'
import WorkoutExecutionRepository from "./interface";


const workouts = new MockMeteorWorkoutRepository().listWorkouts()


const workoutUser1 = new User(
  crypto.randomUUID(), "User1", {[IntensityZone.Paddle]: 400, [IntensityZone.Steady]: 300, [IntensityZone.Race]: 200, [IntensityZone.Sprint]: 100}, Rank.IV
)
const workoutUser2 = new User(
  crypto.randomUUID(), "User2", {[IntensityZone.Paddle]: 400, [IntensityZone.Steady]: 300, [IntensityZone.Race]: 200, [IntensityZone.Sprint]: 100}, Rank.IV
)


const workoutExecutions = new Map<string, WorkoutExecution>([
  ["executionId1", new WorkoutExecution("executionId1", workouts[0], workoutUser1, {distance: 4500, time: new TimeDelta(30*60*1000), score: 12})],
  ["executionId2", new WorkoutExecution("executionId2", workouts[0], workoutUser1, {distance: 4500, time: new TimeDelta(32*60*1000), score: 13})],
  ["executionId3", new WorkoutExecution("executionId3", workouts[1], workoutUser1, {distance: 4500, time: new TimeDelta(32*60*1000), score: 14})],
  ["executionId4", new WorkoutExecution("executionId4", workouts[1], workoutUser2, {distance: 4500, time: new TimeDelta(32*60*1000), score: 15})],
])


export class MockWorkoutExecutionRepository implements WorkoutExecutionRepository{

  listWorkoutExecutionsForWorkoutSortedByScore(workoutId: string, limit?: number): Array<WorkoutExecution>{
    limit = limit === undefined ? 10 : limit;

    return Array.from(workoutExecutions.values()).filter(
      execution => execution.workout.workoutId == workoutId
    ).toSorted(
      (a, b) => b.result.score - a.result.score
    ).slice(
      0, limit
    );
  }
  
  getWorkoutExecution(workoutExecutionId: string): WorkoutExecution | undefined {
    return workoutExecutions.get(workoutExecutionId);
  }

  storeWorkoutExecution(workoutExecution: WorkoutExecution): void {
    workoutExecutions.set(workoutExecution.workoutExecutionId, workoutExecution);
  }


}