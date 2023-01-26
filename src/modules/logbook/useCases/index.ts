import {
  dateServiceImpl,
  fileServiceImpl,
  uuidServiceImpl,
} from "../../shared/infrastructure/services";
import {
  categoryRepoImpl,
  fileRepoImpl,
  goalRepoImpl,
  logbookRepoImpl,
  logRepoImpl,
  rewardRepoImpl,
} from "../infrastructure/repositories";
import { CreateCategoryImpl } from "./createCategory";
import { CreateFileImpl } from "./createFile";
import { CreateGoalImpl } from "./createGoal";
import { CreateLogImpl } from "./createLog";
import { CreateLogbookImpl } from "./createLogbook";
import { CreateRewardImpl } from "./createReward";
import { DeleteCategoryImpl } from "./deleteCategory";
import { DeleteFileImpl } from "./deleteFile";
import { DeleteLogImpl } from "./deleteLog";
import { DeleteLogbookImpl } from "./deleteLogbook";
import { DeleteRewardImpl } from "./deleteReward";
import { GetCategoriesImpl } from "./getCategories";
import { GetCategoryImpl } from "./getCategory";
import { GetEarliestLogbookYearImpl } from "./getEarliestLogbookYear";
import { GetGoalImpl } from "./getGoal";
import { GetLiteLogbookImpl } from "./getLiteLogbook";
import { GetLiteRewardsImpl } from "./getLiteRewards";
import { GetLogImpl } from "./getLog";
import { GetLogbookImpl } from "./getLogbook";
import { GetLogbooksImpl } from "./getLogbooks";
import { GetLogsImpl } from "./getLogs";
import { GetRewardImpl } from "./getReward";
import { GetRewardsImpl } from "./getRewards";
import { UpdateCategoryImpl } from "./updateCategory";
import { UpdateGoalImpl } from "./updateGoal";
import { UpdateLogImpl } from "./updateLog";
import { UpdateLogbookImpl } from "./updateLogbook";
import { UpdateRewardImpl } from "./updateReward";

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

export const createFileImpl = new CreateFileImpl(
  fileRepoImpl,
  uuidServiceImpl,
  fileServiceImpl
);

export const createLogImpl = new CreateLogImpl(
  logRepoImpl,
  createFileImpl,
  uuidServiceImpl
);

export const createRewardImpl = new CreateRewardImpl(
  uuidServiceImpl,
  fileServiceImpl,
  rewardRepoImpl
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

export const deleteFileImpl = new DeleteFileImpl(fileRepoImpl, fileServiceImpl);

export const updateLogImpl = new UpdateLogImpl(
  logRepoImpl,
  uuidServiceImpl,
  createFileImpl,
  deleteFileImpl,
  dateServiceImpl
);

export const getGoalImpl = new GetGoalImpl(goalRepoImpl);

export const getLiteRewardsImpl = new GetLiteRewardsImpl(rewardRepoImpl);

export const getLogImpl = new GetLogImpl(logRepoImpl);

export const deleteLogImpl = new DeleteLogImpl(
  logRepoImpl,
  deleteFileImpl,
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

export const getLogbooksImpl = new GetLogbooksImpl(
  logbookRepoImpl,
  getLogbookImpl
);

export const deleteCategoryImpl = new DeleteCategoryImpl(categoryRepoImpl);

export const getCategoryImpl = new GetCategoryImpl(categoryRepoImpl);

export const deleteLogbookImpl = new DeleteLogbookImpl(logbookRepoImpl);

export const deleteRewardImpl = new DeleteRewardImpl(
  rewardRepoImpl,
  fileServiceImpl
);

export const getRewardImpl = new GetRewardImpl(rewardRepoImpl);

export const getCategoriesImpl = new GetCategoriesImpl(categoryRepoImpl);

export const updateCategoryImpl = new UpdateCategoryImpl(
  categoryRepoImpl,
  uuidServiceImpl
);

export const getEarliestLogbookYearImpl = new GetEarliestLogbookYearImpl(
  logbookRepoImpl
);

export const updateRewardImpl = new UpdateRewardImpl(
  uuidServiceImpl,
  fileServiceImpl,
  rewardRepoImpl
);
