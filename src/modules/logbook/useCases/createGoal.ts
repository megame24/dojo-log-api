import AppError from "../../shared/AppError";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import { User } from "../../users/api";
import Goal from "../entities/goal";
import Logbook from "../entities/logbook";
import Reward from "../entities/reward";
import { GoalRepo } from "../infrastructure/repositories/goalRepo";
import { CreateReward, CreateRewardDTO } from "./createReward";

interface CreateGoalDTO {
  userId: string;
  logbook: Logbook;
  name: string;
  achievementCriteria?: string;
  date: Date;
  rewards: Reward[];
  rewardsProps: Partial<CreateRewardDTO>[];
  user: User;
}

export interface CreateGoal extends UseCase<CreateGoalDTO, Promise<Goal>> {
  execute: (createGoalDTO: CreateGoalDTO) => Promise<Goal>;
}

export class CreateGoalImpl implements CreateGoal {
  constructor(
    private uuidService: UUIDService,
    private createReward: CreateReward,
    private goalRepo: GoalRepo
  ) {}

  async execute(createGoalDTO: CreateGoalDTO): Promise<Goal> {
    const { rewardsProps, userId, logbook, date, user } = createGoalDTO; // send date in iso
    let { rewards } = createGoalDTO;
    //  GET START OF TODAY AND END OF TODAY, MUST BE INBETWEEN, EDGE INCLUSIVE!!!
    const existingGoal = await this.goalRepo.getGoalByLogbookIdAndDate(
      <string>logbook.id,
      date
    );
    if (existingGoal)
      throw AppError.badRequestError(
        "More than one goal can't share the same date in the same Logbook"
      );

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
        userId,
        user,
        save: true,
      };
      return this.createReward.execute(createRewardDTO);
    });
    const createdRewards = await Promise.all(createdRewardsPromise);
    rewards = [...rewards, ...createdRewards];

    const createGoalProps = {
      logbookId: <string>logbook.id,
      visibility: logbook.visibility,
      userId,
      name: createGoalDTO.name,
      achieved: false,
      achievementCriteria: createGoalDTO.achievementCriteria,
      date,
      rewards,
    };

    const goal = Goal.create(createGoalProps, this.uuidService);

    await this.goalRepo.create(goal, user);
    return goal;
  }
}
