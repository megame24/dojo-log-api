import UseCase from "../../shared/useCases/useCase";
import GoalNotification from "../entities/goalNotification";
import { GoalNotificationRepo } from "../infrastructure/repositories/goalNotificationRepo";

interface BatchUpdateGoalNotificationsDTO {
  goalNotifications: Partial<GoalNotification>[];
}

export interface BatchUpdateGoalNotifications
  extends UseCase<BatchUpdateGoalNotificationsDTO, void> {
  execute: (
    batchUpdateGoalNotificationsDTO: BatchUpdateGoalNotificationsDTO
  ) => void;
}

export class BatchUpdateGoalNotificationsImpl
  implements BatchUpdateGoalNotifications
{
  constructor(private goalNotificationRepo: GoalNotificationRepo) {}

  async execute(
    batchUpdateGoalNotificationsDTO: BatchUpdateGoalNotificationsDTO
  ) {
    const { goalNotifications } = batchUpdateGoalNotificationsDTO;
    const batchSize = 10;

    for (let i = 0; i < goalNotifications.length; i += batchSize) {
      const batch = goalNotifications.slice(i, i + batchSize);
      const promises = batch.map((goalNotification) =>
        this.goalNotificationRepo.update(goalNotification)
      );
      await Promise.all(promises);
    }
  }
}
