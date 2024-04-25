import { userGoalNotificationRepoImpl } from "../infrastructure/repositories";
import { GetUserGoalNotificationsImpl } from "./getUserGoalNotifications";

export const getUserGoalNotificationsImpl = new GetUserGoalNotificationsImpl(
  userGoalNotificationRepoImpl
);
