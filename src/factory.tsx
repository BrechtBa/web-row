import MeteorWorkoutExecutionRepository from './workoutRepository/execution/interface';
import { FirebaseMeteorWorkoutExecutionRepository } from './workoutRepository/execution/firebaseWorkoutExecutionRepository';
import MeteorWorkoutRepository from './workoutRepository/meteor/interface'

import MockMeteorWorkoutRepository from './workoutRepository/meteor/mockMeteorWorkoutRepository'
import { FirebaseUserRepository } from '@/userRepository/firebase';
import { UserRepository } from '@/userRepository/interface';


export function getMeteorWorkoutRepository(): MeteorWorkoutRepository {
  const repo = new MockMeteorWorkoutRepository();
  return repo;
}

export default function getUserRepository(): UserRepository {
  return new FirebaseUserRepository();
}


export function getMeteorWorkoutExecutionRepository(): MeteorWorkoutExecutionRepository {
  const repo = new FirebaseMeteorWorkoutExecutionRepository();
  return repo;
}

