import AppError from "../../shared/AppError";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Goal from "../entities/goal";
import Logbook from "../entities/logbook";
import Reward from "../entities/reward";
import { GoalRepo } from "../infrastructure/repositories/goalRepo";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";
import { CreateReward, CreateRewardDTO } from "./createReward";

interface CreateGoalDTO {
  userId: string;
  logbook: Logbook;
  name: string;
  description?: string;
  achievementCriteria: string;
  date: Date;
  rewardIds: string[];
  rewardsProps: Partial<CreateRewardDTO>[];
}

export interface CreateGoal extends UseCase<CreateGoalDTO, void> {
  execute: (createGoalDTO: CreateGoalDTO) => void;
}

export class CreateGoalImpl implements CreateGoal {
  constructor(
    private uuidService: UUIDService,
    private createReward: CreateReward,
    private goalRepo: GoalRepo,
    private rewardRepo: RewardRepo
  ) {}

  async execute(createGoalDTO: CreateGoalDTO) {
    const { rewardIds, rewardsProps, userId, logbook, date } = createGoalDTO;

    const existingGoal = await this.goalRepo.getGoalByLogbookIdAndDate(
      <string>logbook.id,
      date
    );
    if (existingGoal)
      throw AppError.badRequestError(
        "More than one goal can't share the same date"
      );

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

    const createGoalProps = {
      logbookId: <string>logbook.id,
      visibility: logbook.visibility,
      userId,
      name: createGoalDTO.name,
      description: createGoalDTO.description,
      achieved: false,
      achievementCriteria: createGoalDTO.achievementCriteria,
      date,
      rewards,
    };

    const goal = Goal.create(createGoalProps, this.uuidService);

    await this.goalRepo.create(goal);
  }
}
