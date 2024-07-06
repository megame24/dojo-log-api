import {
  getUserGoalNotificationsImpl,
  getUserLogbookNotificationsImpl,
} from "../../useCases";
import GetUserGoalNotificationsController from "./getUserGoalNotificationsController";
import GetUserLogbookNotificationsController from "./getUserLogbookNotificationsController";

export const getUserGoalNotificationsController =
  new GetUserGoalNotificationsController(getUserGoalNotificationsImpl);

export const getUserLogbookNotificationsController =
  new GetUserLogbookNotificationsController(getUserLogbookNotificationsImpl);
