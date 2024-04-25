import UseCase from "../../shared/useCases/useCase";
import GoalNotification from "../entities/goalNotification";
import { GoalNotificationRepo } from "../infrastructure/repositories/goalNotificationRepo";

interface BatchDeleteGoalNotificationsDTO {
  goalNotifications: Partial<GoalNotification>[];
}

export interface BatchDeleteGoalNotifications
  extends UseCase<BatchDeleteGoalNotificationsDTO, void> {
  execute: (
    batchDeleteGoalNotificationsDTO: BatchDeleteGoalNotificationsDTO
  ) => void;
}

export class BatchDeleteGoalNotificationsImpl
  implements BatchDeleteGoalNotifications
{
  constructor(private goalNotificationRepo: GoalNotificationRepo) {}

  async execute(
    batchDeleteGoalNotificationsDTO: BatchDeleteGoalNotificationsDTO
  ) {
    const { goalNotifications } = batchDeleteGoalNotificationsDTO;
    const batchSize = 10;

    for (let i = 0; i < goalNotifications.length; i += batchSize) {
      const batch = goalNotifications.slice(i, i + batchSize);
      const promises = batch.map((goalNotification) =>
        this.goalNotificationRepo.delete(goalNotification)
      );
      await Promise.all(promises);
    }
  }
}
