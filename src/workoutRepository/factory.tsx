import WorkoutExecutionRepository from './execution/interface';
import { MockWorkoutExecutionRepository } from './execution/mockWorkoutExecutionRepository';
import MeteorWorkoutRepository from './meteor/interface'

import MockMeteorWorkoutRepository from './meteor/mockMeteorWorkoutRepository'


export function getMeteorWorkoutRepository(): MeteorWorkoutRepository {
  const repo = new MockMeteorWorkoutRepository();
  return repo;
}

export function getWorkoutExecutionRepository(): WorkoutExecutionRepository {
  const repo = new MockWorkoutExecutionRepository();
  return repo;
}