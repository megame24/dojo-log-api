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
import { GetLiteGoalImpl } from "./getLiteGoal";
import { GetLiteLogbookImpl } from "./getLiteLogbook";
import { GetLiteRewardsImpl } from "./getLiteRewards";
import { GetLogImpl } from "./getLog";
import { GetLogbookImpl } from "./getLogbook";
import { UpdateGoalImpl } from "./updateGoal";
import { UpdateLogImpl } from "./updateLog";

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
  rewardRepoImpl
);

export const getLogbookImpl = new GetLogbookImpl(logbookRepoImpl);

export const updateGoalImpl = new UpdateGoalImpl(
  createRewardImpl,
  goalRepoImpl,
  rewardRepoImpl,
  uuidServiceImpl
);

export const updateLogImpl = new UpdateLogImpl(
  logRepoImpl,
  uuidServiceImpl,
  fileServiceImpl
);

export const getLiteGoalImpl = new GetLiteGoalImpl(goalRepoImpl);

export const getLiteRewardsImpl = new GetLiteRewardsImpl(rewardRepoImpl);

export const getLogImpl = new GetLogImpl(logRepoImpl);
