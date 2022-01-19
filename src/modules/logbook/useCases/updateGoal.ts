import { CreateReward, CreateRewardDTO } from "./createReward";
import UseCase from "../../shared/useCases/useCase";
import { GoalRepo } from "../infrastructure/repositories/goalRepo";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";
import AppError from "../../shared/AppError";
import Reward from "../entities/reward";
import Goal from "../entities/goal";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import { DateService } from "../infrastructure/services/dateService";
import { User } from "../../users/api";

interface UpdateGoalDTO {
  goal: Goal;
  achieved: boolean;
  rewards: Reward[];
  rewardsProps: Partial<CreateRewardDTO>[];
  user: User;
}

export interface UpdateGoal extends UseCase<UpdateGoalDTO, void> {
  execute: (updateGoalDTO: UpdateGoalDTO) => void;
}

export class UpdateGoalImpl implements UpdateGoal {
  constructor(
    private createReward: CreateReward,
    private goalRepo: GoalRepo,
    private rewardRepo: RewardRepo,
    private uuidService: UUIDService,
    private dateService: DateService
  ) {}

  async execute(updateGoalDTO: UpdateGoalDTO) {
    const { rewardsProps, achieved, goal: outdatedGoal, user } = updateGoalDTO;
    let { rewards } = updateGoalDTO;

    const rewardsLength = Object.keys(rewardsProps).length + rewards.length;
    if (rewardsLength > 5) {
      throw AppError.badRequestError("A Goal can't have more than 5 rewards");
    }

    const createdRewardsPromise: Promise<Reward>[] = Object.values(
      rewardsProps
    ).map((rewardProps) => {
      const createRewardDTO = {
        ...rewardProps,
        name: <string>rewardProps.name,
        userId: outdatedGoal.userId,
      };
      return this.createReward.execute(createRewardDTO);
    });
    const createdRewards = await Promise.all(createdRewardsPromise);
    rewards = [...rewards, ...createdRewards];

    if (rewards.length) await this.rewardRepo.bulkUpsert(rewards);

    const updateGoalProps = {
      id: outdatedGoal.id,
      logbookId: outdatedGoal.logbookId,
      userId: outdatedGoal.userId,
      visibility: outdatedGoal.visibility,
      name: outdatedGoal.name,
      description: outdatedGoal.description,
      achievementCriteria: outdatedGoal.achievementCriteria,
      date: outdatedGoal.date,
      achieved: outdatedGoal.achieved,
      ...(rewards.length && { rewards }),
    };

    if (typeof achieved === "boolean") {
      updateGoalProps.achieved = achieved;
    }

    const updatedGoal = Goal.create(
      updateGoalProps,
      this.uuidService,
      this.dateService
    );

    const outdatedRewards = outdatedGoal.rewards || [];
    await this.goalRepo.update(updatedGoal, outdatedRewards, user);
  }
}
