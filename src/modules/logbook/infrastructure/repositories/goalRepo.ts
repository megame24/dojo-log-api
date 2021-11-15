import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import Goal from "../../entities/goal";
import { RewardRepo } from "./rewardRepo";

export interface GoalRepo {
  create: (goal: Goal) => void;
  getGoalByDate: (date: Date) => Promise<Goal | null>;
}

export class GoalRepoImpl implements GoalRepo {
  constructor(
    private uuidService: UUIDService,
    private GoalModel: any,
    private rewardRepo: RewardRepo
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

  async getGoalByDate(date: Date): Promise<Goal | null> {
    const queryOption = { where: { date } };

    return this.getGoal(queryOption);
  }
}
