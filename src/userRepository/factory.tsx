import { UserRepository } from "./interface";

import { FirebaseUserRepository } from './firebase'


export default function getUserRepository(): UserRepository {

  return new FirebaseUserRepository()
}