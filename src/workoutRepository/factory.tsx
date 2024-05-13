import MeteorWorkoutExecutionRepository from './execution/interface';
import { MockMeteorWorkoutExecutionRepository } from './execution/mockWorkoutExecutionRepository';
import MeteorWorkoutRepository from './meteor/interface'

import MockMeteorWorkoutRepository from './meteor/mockMeteorWorkoutRepository'


export function getMeteorWorkoutRepository(): MeteorWorkoutRepository {
  const repo = new MockMeteorWorkoutRepository();
  return repo;
}

export function getWorkoutExecutionRepository(): MeteorWorkoutExecutionRepository {
  const repo = new MockMeteorWorkoutExecutionRepository();
  return repo;
}