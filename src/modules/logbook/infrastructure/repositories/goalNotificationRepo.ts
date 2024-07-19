import AppError from "../../../shared/AppError";
import GoalNotification from "../../entities/goalNotification";

export interface GoalNotificationRepo {
  create: (goalNotification: GoalNotification) => void;
  update: (goalNotification: Partial<GoalNotification>) => void;
  delete: (goalNotification: Partial<GoalNotification>) => void;
}

export class GoalNotificationRepoImpl implements GoalNotificationRepo {
  constructor(private GoalNotificationModel: any) {}

  async create(goalNotification: GoalNotification) {
    try {
      const goalNotificationProps = {
        id: goalNotification.id,
        goalId: goalNotification.goalId,
        notificationDate: goalNotification.notificationDate,
        finalNotificationDate: goalNotification.finalNotificationDate,
      };

      await this.GoalNotificationModel.create(goalNotificationProps);
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error creating goal notification",
        error
      );
    }
  }

  async update(goalNotification: Partial<GoalNotification>) {
    try {
      await this.GoalNotificationModel.update(
        {
          notificationDate: goalNotification.notificationDate,
        },
        { where: { id: goalNotification.id } }
      );
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error updating goal notification",
        error
      );
    }
  }

  async delete(goalNotification: Partial<GoalNotification>) {
    try {
      await this.GoalNotificationModel.destroy({
        where: { id: goalNotification.id },
      });
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error deleting goal notification",
        error
      );
    }
  }
}
