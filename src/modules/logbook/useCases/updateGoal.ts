import { CreateReward, CreateRewardDTO } from "./createReward";
import UseCase from "../../shared/useCases/useCase";
import { GoalRepo } from "../infrastructure/repositories/goalRepo";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";
import AppError from "../../shared/AppError";
import Reward from "../entities/reward";
import Goal from "../entities/goal";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

interface UpdateGoalDTO {
  userId: string;
  goalId: string;
  achieved: boolean;
  rewardIds: string[];
  rewardsProps: Partial<CreateRewardDTO>[];
}

export interface UpdateGoal extends UseCase<UpdateGoalDTO, void> {
  execute: (updateGoalDTO: UpdateGoalDTO) => void;
}

export class UpdateGoalImpl implements UpdateGoal {
  constructor(
    private createReward: CreateReward,
    private goalRepo: GoalRepo,
    private rewardRepo: RewardRepo,
    private uuidService: UUIDService
  ) {}

  async execute(updateGoalDTO: UpdateGoalDTO) {
    const { rewardIds, rewardsProps, goalId, achieved, userId } = updateGoalDTO;

    const outdatedGoal = await this.goalRepo.getGoalById(goalId);

    if (!outdatedGoal) throw AppError.notFoundError("Goal not found");

    const rewardsLength = Object.keys(rewardsProps).length + rewardIds.length;
    if (rewardsLength > 5) {
      throw AppError.badRequestError("A Goal can't have more than 5 rewards");
    }

    let rewards: Reward[] = [];
    const retrievedRewards = await this.rewardRepo.findAllByIdsAndUserId(
      rewardIds,
      userId
    );
    if (retrievedRewards.length !== rewardIds.length) {
      throw AppError.forbiddenError();
    }
    rewards = [...retrievedRewards];

    const createdRewardsPromise: Promise<Reward>[] = Object.values(
      rewardsProps
    ).map((rewardProps) => {
      const createRewardDTO = {
        ...rewardProps,
        name: <string>rewardProps.name,
        userId,
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

    const updatedGoal = Goal.create(updateGoalProps, this.uuidService);

    const outdatedRewards = outdatedGoal.rewards || [];
    await this.goalRepo.update(updatedGoal, outdatedRewards);
  }
}
