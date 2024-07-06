import models from "../../../shared/infrastructure/database/models";
import { uuidServiceImpl } from "../../../shared/infrastructure/services";
import { UserGoalNotificationRepoImpl } from "./userGoalNotificationRepo";
import { UserLogbookNotificationRepoImpl } from "./userLogbookNotificationRepo";

const { sequelize } = <any>models;

export const userGoalNotificationRepoImpl = new UserGoalNotificationRepoImpl(
  sequelize,
  uuidServiceImpl
);

export const userLogbookNotificationRepoImpl =
  new UserLogbookNotificationRepoImpl(sequelize, uuidServiceImpl);
