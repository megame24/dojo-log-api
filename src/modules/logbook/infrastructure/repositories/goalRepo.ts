import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import { User } from "../../../users/api";
import Goal from "../../entities/goal";
import Reward from "../../entities/reward";

export interface GoalRepo {
  create: (goal: Goal, createdBy: User) => void;
  getGoalByLogbookIdAndDate: (
    logbookId: string,
    date: Date
  ) => Promise<Goal | null>;
  getGoalsByLogbookIdStartAndEndDates: (
    logbookId: string,
    startDate: Date,
    endDate: Date
  ) => Promise<Goal[]>;
  getGoalById: (goalId: string) => Promise<Goal | null>;
  update: (goal: Goal, outdatedRewards: Reward[], updatedBy: User) => void;
}

export class GoalRepoImpl implements GoalRepo {
  constructor(
    private uuidService: UUIDService,
    private GoalModel: any,
    private RewardModel: any,
    private LogbookModel: any,
    private Op: any
  ) {}

  async create(goal: Goal, createdBy: User) {
    try {
      const goalProps = {
        id: goal.id,
        logbookId: goal.logbookId,
        userId: goal.userId,
        name: goal.name,
        achieved: goal.achieved,
        achievementCriteria: goal.achievementCriteria,
        date: goal.date,
        createdBy: createdBy.id,
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

    const rewards = goalData.Rewards?.map((rewardData: any) => {
      const createRewardProps = {
        id: rewardData.id,
        userId: rewardData.userId,
        name: rewardData.name,
        description: rewardData.description,
      };

      return Reward.create(createRewardProps, this.uuidService);
    });

    const createGoalProps = {
      id: goalData.id,
      logbookId: goalData.logbookId,
      userId: goalData.userId,
      visibility: goalData.Logbook.visibility,
      name: goalData.name,
      achieved: goalData.achieved,
      achievementCriteria: goalData.achievementCriteria,
      date: goalData.date,
      rewards,
    };

    return Goal.create(createGoalProps, this.uuidService);
  }

  private async getGoals(queryOption: any, logbookData: any): Promise<Goal[]> {
    let goalsData: any[];

    try {
      goalsData = await this.GoalModel.findAll({
        include: [
          { model: this.RewardModel, required: false },
          ...(queryOption?.include ? queryOption.include : []),
        ],
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
        visibility: logbookData.visibility,
        name: goalData.name,
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
    const queryOption = {
      where: { logbookId, date },
      include: { model: this.LogbookModel, required: true },
    };

    return this.getGoal(queryOption);
  }

  async getGoalById(goalId: string): Promise<Goal | null> {
    const queryOption = {
      where: { id: goalId },
      include: [
        { model: this.LogbookModel, required: true },
        { model: this.RewardModel, required: false },
      ],
    };

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

    const logbookData = await this.LogbookModel.findByPk(logbookId);
    if (!logbookData) throw AppError.notFoundError("Logbook not found");

    return this.getGoals(queryOption, logbookData);
  }

  async update(goal: Goal, outdatedRewards: Reward[] = [], updatedBy: User) {
    try {
      const updatedData = await this.GoalModel.update(
        {
          id: goal.id,
          logbookId: goal.logbookId,
          userId: goal.userId,
          name: goal.name,
          achieved: goal.achieved,
          achievementCriteria: goal.achievementCriteria,
          date: goal.date,
          updatedBy: updatedBy.id,
        },
        {
          where: { id: goal.id },
          returning: true,
        }
      );
      const updatedGoal = updatedData[1][0];

      if (goal.rewards?.length) {
        const outDatedRewardIds = outdatedRewards.map((reward) => reward.id);
        await updatedGoal.removeRewards(outDatedRewardIds);

        const updatedGoalRewardIds = goal.rewards.map((reward) => reward.id);
        await updatedGoal.addRewards(updatedGoalRewardIds);
      }
    } catch (error: any) {
      throw AppError.internalServerError("Error updating goal", error);
    }
  }
}
