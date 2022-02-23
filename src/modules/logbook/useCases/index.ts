import {
  fileServiceImpl,
  uuidServiceImpl,
} from "../../shared/infrastructure/services";
import {
  categoryRepoImpl,
  goalRepoImpl,
  logbookRepoImpl,
  logRepoImpl,
  rewardRepoImpl,
} from "../infrastructure/repositories";
import { dateServiceImpl } from "../infrastructure/services";
import { CreateCategoryImpl } from "./createCategory";
import { CreateGoalImpl } from "./createGoal";
import { CreateLogImpl } from "./createLog";
import { CreateLogbookImpl } from "./createLogbook";
import { CreateRewardImpl } from "./createReward";
import { DeleteCategoryImpl } from "./deleteCategory";
import { DeleteLogImpl } from "./deleteLog";
import { DeleteLogbookImpl } from "./deleteLogbook";
import { GetCategoryImpl } from "./getCategory";
import { GetGoalImpl } from "./getGoal";
import { GetLiteLogbookImpl } from "./getLiteLogbook";
import { GetLiteRewardsImpl } from "./getLiteRewards";
import { GetLogImpl } from "./getLog";
import { GetLogbookImpl } from "./getLogbook";
import { GetLogbooksImpl } from "./getLogbooks";
import { GetLogsImpl } from "./getLogs";
import { GetRewardsImpl } from "./getRewards";
import { UpdateGoalImpl } from "./updateGoal";
import { UpdateLogImpl } from "./updateLog";
import { UpdateLogbookImpl } from "./updateLogbook";

export const createCategoryImpl = new CreateCategoryImpl(
  categoryRepoImpl,
  uuidServiceImpl
);

export const createLogbookImpl = new CreateLogbookImpl(
  logbookRepoImpl,
  categoryRepoImpl,
  uuidServiceImpl,
  dateServiceImpl
);

export const getLiteLogbookImpl = new GetLiteLogbookImpl(logbookRepoImpl);

export const createLogImpl = new CreateLogImpl(
  logRepoImpl,
  uuidServiceImpl,
  fileServiceImpl
);

export const createRewardImpl = new CreateRewardImpl(
  uuidServiceImpl,
  fileServiceImpl
);

export const createGoalImpl = new CreateGoalImpl(
  uuidServiceImpl,
  createRewardImpl,
  goalRepoImpl,
  rewardRepoImpl,
  dateServiceImpl
);

export const getLogbookImpl = new GetLogbookImpl(logbookRepoImpl);

export const updateGoalImpl = new UpdateGoalImpl(
  createRewardImpl,
  goalRepoImpl,
  rewardRepoImpl,
  uuidServiceImpl,
  dateServiceImpl
);

export const updateLogImpl = new UpdateLogImpl(
  logRepoImpl,
  uuidServiceImpl,
  fileServiceImpl,
  dateServiceImpl
);

export const getGoalImpl = new GetGoalImpl(goalRepoImpl);

export const getLiteRewardsImpl = new GetLiteRewardsImpl(rewardRepoImpl);

export const getLogImpl = new GetLogImpl(logRepoImpl);

export const deleteLogImpl = new DeleteLogImpl(
  logRepoImpl,
  fileServiceImpl,
  dateServiceImpl
);

export const getLogsImpl = new GetLogsImpl(logRepoImpl);

export const updateLogbookImpl = new UpdateLogbookImpl(
  logbookRepoImpl,
  uuidServiceImpl,
  categoryRepoImpl,
  dateServiceImpl
);

export const getRewardsImpl = new GetRewardsImpl(rewardRepoImpl);

export const getLogbooksImpl = new GetLogbooksImpl(logbookRepoImpl);

export const deleteCategoryImpl = new DeleteCategoryImpl(categoryRepoImpl);

export const getCategoryImpl = new GetCategoryImpl(categoryRepoImpl);

export const deleteLogbookImpl = new DeleteLogbookImpl(logbookRepoImpl);
