import MeteorWorkoutRepository from './meteor/interface'

import MockMeteorWorkoutRepository from './meteor/mockMeteorWorkoutRepository'


export function getMeteorWorkoutRepository(): MeteorWorkoutRepository {
  const repo = new MockMeteorWorkoutRepository();
  return repo;
}