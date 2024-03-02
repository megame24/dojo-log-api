import { dateServiceImpl } from "../../../shared/infrastructure/services";
import { GoalNotificationServiceImpl } from "./goalNotificationService";

export const goalNotificationServiceImpl = new GoalNotificationServiceImpl(
  dateServiceImpl
);
