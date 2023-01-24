import models from "../../../shared/infrastructure/database/models";
import {
  dateServiceImpl,
  uuidServiceImpl,
} from "../../../shared/infrastructure/services";
import { CategoryRepoImpl } from "./categoryRepo";
import { FileRepoImpl } from "./fileRepo";
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
  File,
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

export const rewardRepoImpl = new RewardRepoImpl(uuidServiceImpl, Reward, Op);

export const goalRepoImpl = new GoalRepoImpl(
  uuidServiceImpl,
  Goal,
  Reward,
  Logbook,
  Op,
  dateServiceImpl
);

export const logbookRepoImpl = new LogbookRepoImpl(
  Logbook,
  Category,
  uuidServiceImpl,
  dateServiceImpl,
  goalRepoImpl,
  logRepoImpl
);

export const fileRepoImpl = new FileRepoImpl(File);
