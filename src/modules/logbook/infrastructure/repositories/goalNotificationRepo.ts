import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import GoalNotification from "../../entities/goalNotification";

export interface GoalNotificationRepo {
  create: (goalNotification: GoalNotification) => void;
}

export class GoalNotificationRepoImpl implements GoalNotificationRepo {
  constructor(
    private GoalNotificationModel: any,
    private uuidService: UUIDService
  ) {}

  async create(goalNotification: GoalNotification) {
    try {
      const goalNotificationProps = {
        id: goalNotification.id,
        goalId: goalNotification.goalId,
        notificationDate: goalNotification.notificationDate,
      };

      await this.GoalNotificationModel.create(goalNotificationProps);
    } catch (error: any) {
      throw AppError.internalServerError("Error setting goal ", error);
    }
  }
}
