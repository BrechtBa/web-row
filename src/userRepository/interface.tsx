import { User } from "@/domain/user"

export interface UserRepository{
  onUserSignedInChanged(signedInCallback: (user: User) => void): void;
  listLocalUsers(): Promise<Array<User>>;
  createUser(email: string, password: string, displayName: string): Promise<User>;
  signInUser(email: string, password: string): Promise<User>;
  getUserByUserId(userId: string): Promise<User>;
}

