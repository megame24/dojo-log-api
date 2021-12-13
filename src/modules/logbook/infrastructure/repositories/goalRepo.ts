import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import Goal from "../../entities/goal";
import Reward from "../../entities/reward";
import { RewardRepo } from "./rewardRepo";

export interface GoalRepo {
  create: (goal: Goal) => void;
  getGoalByLogbookIdAndDate: (
    logbookId: string,
    date: Date
  ) => Promise<Goal | null>;
  getGoalsByLogbookIdStartAndEndDates: (
    logbookId: string,
    startDate: Date,
    endDate: Date
  ) => Promise<Goal[]>;
}

export class GoalRepoImpl implements GoalRepo {
  constructor(
    private uuidService: UUIDService,
    private GoalModel: any,
    private RewardModel: any,
    private rewardRepo: RewardRepo,
    private Op: any
  ) {}

  async create(goal: Goal) {
    if (goal.rewards) await this.rewardRepo.bulkUpsert(goal.rewards);

    try {
      const goalProps = {
        id: goal.id,
        logbookId: goal.logbookId,
        userId: goal.userId,
        visibility: goal.visibility,
        name: goal.name,
        description: goal.description,
        achieved: goal.achieved,
        achievementCriteria: goal.achievementCriteria,
        date: goal.date,
      };

      const createdGoal = await this.GoalModel.create(goalProps);

      const rewardIds = goal.rewards?.map((reward) => reward.id);
      await createdGoal.addRewards(rewardIds);
    } catch (error: any) {
      throw AppError.internalServerError("Error creating goal", error);
    }
  }

  private async getGoal(queryOption: any): Promise<Goal | null> {
    let goalData: any;

    try {
      goalData = await this.GoalModel.findOne(queryOption);
    } catch (error: any) {
      throw AppError.internalServerError("Error retrieving Goal", error);
    }

    if (!goalData) return null;

    const createGoalProps = {
      id: goalData.id,
      logbookId: goalData.logbookId,
      userId: goalData.userId,
      visibility: goalData.visibility,
      name: goalData.name,
      description: goalData.description,
      achieved: goalData.achieved,
      achievementCriteria: goalData.achievementCriteria,
      date: goalData.date,
    };

    return Goal.create(createGoalProps, this.uuidService);
  }

  private async getGoals(queryOption: any): Promise<Goal[]> {
    let goalsData: any[];

    try {
      goalsData = await this.GoalModel.findAll({
        include: { model: this.RewardModel, required: false },
        ...queryOption,
      });
    } catch (error: any) {
      throw AppError.internalServerError("Error retrieving Goals", error);
    }

    if (!goalsData.length) return [];

    const goals: Goal[] = goalsData.map((goalData: any) => {
      const rewards: Reward[] = goalData.Rewards.map((rewardData: any) => {
        const createRewardProps = {
          id: rewardData.id,
          userId: rewardData.userId,
          name: rewardData.name,
          description: rewardData.description,
          imageUrl: rewardData.imageUrl,
        };

        return Reward.create(createRewardProps, this.uuidService);
      });

      const createGoalProps = {
        id: goalData.id,
        logbookId: goalData.logbookId,
        userId: goalData.userId,
        visibility: goalData.visibility,
        name: goalData.name,
        description: goalData.description,
        achieved: goalData.achieved,
        achievementCriteria: goalData.achievementCriteria,
        date: goalData.date,
        rewards,
      };

      return Goal.create(createGoalProps, this.uuidService);
    });

    return Promise.all(goals);
  }

  async getGoalByLogbookIdAndDate(
    logbookId: string,
    date: Date
  ): Promise<Goal | null> {
    const queryOption = { where: { logbookId, date } };

    return this.getGoal(queryOption);
  }

  async getGoalsByLogbookIdStartAndEndDates(
    logbookId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Goal[]> {
    const queryOption = {
      where: {
        logbookId,
        date: {
          [this.Op.gte]: startDate,
          [this.Op.lte]: endDate,
        },
      },
    };
    return this.getGoals(queryOption);
  }
}
