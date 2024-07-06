import {
  userGoalNotificationRepoImpl,
  userLogbookNotificationRepoImpl,
} from "../infrastructure/repositories";
import { GetUserGoalNotificationsImpl } from "./getUserGoalNotifications";
import { GetUserLogbookNotificationsImpl } from "./getUserLogbookNotifications";

export const getUserGoalNotificationsImpl = new GetUserGoalNotificationsImpl(
  userGoalNotificationRepoImpl
);

export const getUserLogbookNotificationsImpl =
  new GetUserLogbookNotificationsImpl(userLogbookNotificationRepoImpl);
