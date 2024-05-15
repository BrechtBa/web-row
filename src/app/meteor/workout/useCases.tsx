import { User } from "@/domain/user";
import { Workout } from "@/domain/workout";
import { MeteorWorkoutResult } from "@/domain/workoutExecution";
import getUserRepository, { getMeteorWorkoutExecutionRepository } from "@/factory";
import { UserRepository } from "@/userRepository/interface";
import MeteorWorkoutExecutionRepository from "@/workoutRepository/execution/interface";
import MeteorWorkoutRepository from "@/workoutRepository/meteor/interface";

export interface MeteorWorkoutRankingEntry {
  workoutExecutionId: string
  user: User;
  result: MeteorWorkoutResult;
}


class MeteorWorkoutUseCases{
  workoutExecutionRepository: MeteorWorkoutExecutionRepository;
  userRepository: UserRepository;

  constructor(workoutExecutionRepository: MeteorWorkoutExecutionRepository, userRepository: UserRepository){
    this.workoutExecutionRepository = workoutExecutionRepository;
    this.userRepository = userRepository;
  }

  async getRankingByWorkoutId(workoutId: string, limit?: number): Promise<Array<MeteorWorkoutRankingEntry>>{
    const wourkoutExecutions = await this.workoutExecutionRepository.listWorkoutExecutionsForWorkoutSortedByScore(workoutId, limit)

    const userIds = wourkoutExecutions.map(execution => execution.userId);
    const userIdsWithoutDuplicates = userIds.filter((item,
      index) => userIds.indexOf(item) === index);

    const users: Array<User> = await Promise.all(userIdsWithoutDuplicates.map(async (userId): Promise<User> => {
      return this.userRepository.getUserByUserId(userId);
    }));

    let userMap = new Map();

    users.forEach(user => {
      userMap.set(user.userId, user);
    });

    const rankingEntries = wourkoutExecutions.map(execution => ({
      workoutExecutionId: execution.workoutExecutionId,
      user: userMap.get(execution.userId),
      result: execution.result
    }));

    return new Promise((resolve) => resolve(rankingEntries));
  }

}

export const meteorWorkoutUseCases = new MeteorWorkoutUseCases(
  getMeteorWorkoutExecutionRepository(), getUserRepository()
)