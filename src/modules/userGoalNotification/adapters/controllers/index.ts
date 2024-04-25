import { getUserGoalNotificationsImpl } from "../../useCases";
import GetUserGoalNotificationsController from "./getUserGoalNotificationsController";

export const getUserGoalNotificationsController =
  new GetUserGoalNotificationsController(getUserGoalNotificationsImpl);
