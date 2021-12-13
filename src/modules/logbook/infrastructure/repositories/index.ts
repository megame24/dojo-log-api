import models from "../../../shared/infrastructure/database/models";
import { uuidServiceImpl } from "../../../shared/infrastructure/services";
import { dateServiceImpl } from "../services";
import { CategoryRepoImpl } from "./categoryRepo";
import { GoalRepoImpl } from "./goalRepo";
import { LogbookRepoImpl } from "./logbookRepo";
import { LogRepoImpl } from "./logRepo";
import { RewardRepoImpl } from "./rewardRepo";

const {
  Category,
  Logbook,
  Log,
  Reward,
  Goal,
  Sequelize: { Op },
} = <any>models;

export const categoryRepoImpl = new CategoryRepoImpl(Category, uuidServiceImpl);

export const logRepoImpl = new LogRepoImpl(Log, uuidServiceImpl, Op);

export const rewardRepoImpl = new RewardRepoImpl(uuidServiceImpl, Reward, Op);

export const goalRepoImpl = new GoalRepoImpl(
  uuidServiceImpl,
  Goal,
  Reward,
  rewardRepoImpl,
  Op
);

export const logbookRepoImpl = new LogbookRepoImpl(
  Logbook,
  Category,
  uuidServiceImpl,
  dateServiceImpl,
  goalRepoImpl,
  logRepoImpl
);
