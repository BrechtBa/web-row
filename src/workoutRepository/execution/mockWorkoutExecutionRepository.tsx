import { TimeDelta, IntensityZone, IntensityZoneSplits } from "@/domain/intensityZone";
import { MeteorWorkoutData, MeteorWorkoutDefinition, MeteorWorkoutIntervalDefinition } from "@/domain/meteor";
import { Workout } from "@/domain/workout";
import { User, Rank } from "@/domain/user";
import { MeteorWorkoutResult, WorkoutExecution } from "@/domain/workoutExecution";

import MockMeteorWorkoutRepository from '../meteor/mockMeteorWorkoutRepository'
import MeteorWorkoutExecutionRepository from "./interface";


const workouts = new MockMeteorWorkoutRepository().listWorkouts()


const workoutUser1 = new User(
  crypto.randomUUID(), "User1", {[IntensityZone.Paddle]: 400, [IntensityZone.Steady]: 300, [IntensityZone.Race]: 200, [IntensityZone.Sprint]: 100}, Rank.IV
)
const workoutUser2 = new User(
  crypto.randomUUID(), "User2", {[IntensityZone.Paddle]: 400, [IntensityZone.Steady]: 300, [IntensityZone.Race]: 200, [IntensityZone.Sprint]: 100}, Rank.IV
)


const workoutExecutions = new Map<string, WorkoutExecution<MeteorWorkoutResult>>([
  ["executionId1", new WorkoutExecution("executionId1", workouts[0].workoutId, workoutUser1.userId, {distance: 4500, time: new TimeDelta(30*60*1000), score: 12, targets: 5})],
  ["executionId2", new WorkoutExecution("executionId2", workouts[0].workoutId, workoutUser1.userId, {distance: 4500, time: new TimeDelta(32*60*1000), score: 13, targets: 5})],
  ["executionId3", new WorkoutExecution("executionId3", workouts[1].workoutId, workoutUser1.userId, {distance: 4500, time: new TimeDelta(32*60*1000), score: 14, targets: 5})],
  ["executionId4", new WorkoutExecution("executionId4", workouts[1].workoutId, workoutUser2.userId, {distance: 4500, time: new TimeDelta(32*60*1000), score: 15, targets: 5})],
])


export class MockMeteorWorkoutExecutionRepository implements MeteorWorkoutExecutionRepository{

  listWorkoutExecutionsForWorkoutSortedByScore(workoutId: string, limit?: number): Promise<Array<WorkoutExecution<MeteorWorkoutResult>>> {
    limit = limit === undefined ? 10 : limit;

    const executions  = Array.from(workoutExecutions.values()).filter(
      execution => execution.workoutId == workoutId
    ).toSorted(
      (a, b) => b.result.score - a.result.score
    ).slice(
      0, limit
    );
    return new Promise((resolve) => resolve(executions));
  }
  
  getWorkoutExecution(workoutExecutionId: string): WorkoutExecution<MeteorWorkoutResult> | undefined {
    return workoutExecutions.get(workoutExecutionId);
  }

  storeWorkoutExecution(workoutExecution: WorkoutExecution<MeteorWorkoutResult>): void {
    workoutExecutions.set(workoutExecution.workoutExecutionId, workoutExecution);
  }

}