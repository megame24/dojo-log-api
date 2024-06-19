import models from "../../../shared/infrastructure/database/models";
import {
  dateServiceImpl,
  uuidServiceImpl,
} from "../../../shared/infrastructure/services";
import { CategoryRepoImpl } from "./categoryRepo";
import { FileRepoImpl } from "./fileRepo";
import { GoalNotificationRepoImpl } from "./goalNotificationRepo";
import { GoalRepoImpl } from "./goalRepo";
import { LogbookNotificationRepoImpl } from "./logbookNotificationRepo";
import { LogbookRepoImpl } from "./logbookRepo";
import { LogRepoImpl } from "./logRepo";
import { RewardRepoImpl } from "./rewardRepo";

const {
  Category,
  Logbook,
  Log,
  Reward,
  Goal,
  File,
  GoalNotification,
  LogbookNotification,
  Sequelize: { Op },
} = <any>models;

export const categoryRepoImpl = new CategoryRepoImpl(Category, uuidServiceImpl);

export const logRepoImpl = new LogRepoImpl(
  Log,
  File,
  Logbook,
  uuidServiceImpl,
  Op
);

export const rewardRepoImpl = new RewardRepoImpl(
  uuidServiceImpl,
  Reward,
  File,
  Op
);

export const goalRepoImpl = new GoalRepoImpl(
  uuidServiceImpl,
  Goal,
  Reward,
  Logbook,
  File,
  Op
);

export const logbookRepoImpl = new LogbookRepoImpl(
  Logbook,
  Category,
  uuidServiceImpl,
  dateServiceImpl
);

export const fileRepoImpl = new FileRepoImpl(File, uuidServiceImpl);

export const goalNotificationRepoImpl = new GoalNotificationRepoImpl(
  GoalNotification
);

export const logbookNotificationsRepoImpl = new LogbookNotificationRepoImpl(
  LogbookNotification
);
