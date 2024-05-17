import { MeteorWorkoutRepository, MeteorWorkoutExecutionRepository } from './workoutRepository/meteor/interface';
import { UserRepository } from '@/userRepository/interface';

import { FirebaseMeteorWorkoutExecutionRepository } from './workoutRepository/meteor/firebaseMeteorWorkoutExecutionRepository';
import { FirebaseMeteorWorkoutRepository } from './workoutRepository/meteor/firebaseMeteorWorkoutRepository';
import { FirebaseUserRepository } from '@/userRepository/firebase';


export function getMeteorWorkoutRepository(): MeteorWorkoutRepository {
  return new FirebaseMeteorWorkoutRepository();
}

export default function getUserRepository(): UserRepository {
  return new FirebaseUserRepository();
}


export function getMeteorWorkoutExecutionRepository(): MeteorWorkoutExecutionRepository {
  return new FirebaseMeteorWorkoutExecutionRepository();
}

