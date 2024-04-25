import models from "../../../shared/infrastructure/database/models";
import { uuidServiceImpl } from "../../../shared/infrastructure/services";
import { UserGoalNotificationRepoImpl } from "./userGoalNotificationRepo";

const { sequelize } = <any>models;

export const userGoalNotificationRepoImpl = new UserGoalNotificationRepoImpl(
  sequelize,
  uuidServiceImpl
);
