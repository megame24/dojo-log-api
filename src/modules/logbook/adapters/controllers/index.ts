import { dateServiceImpl } from "../../infrastructure/services";
import {
  createCategoryImpl,
  createGoalImpl,
  createLogbookImpl,
  createLogImpl,
  deleteCategoryImpl,
  deleteLogbookImpl,
  deleteLogImpl,
  getLogbookImpl,
  getLogbooksImpl,
  getLogsImpl,
  getRewardsImpl,
  updateGoalImpl,
  updateLogbookImpl,
  updateLogImpl,
} from "../../useCases";
import CreateCategoryController from "./createCategoryController";
import CreateGoalController from "./createGoalController";
import CreateLogbookController from "./createLogbookController";
import CreateLogController from "./createLogController";
import DeleteCategoryController from "./deleteCategoryController";
import DeleteLogbookController from "./deleteLogbookController";
import DeleteLogController from "./deleteLogController";
import GetLogbookController from "./getLogbookController";
import GetLogbooksController from "./getLogbooksController";
import GetLogsController from "./getLogsController";
import GetRewardsController from "./getRewardsController";
import UpdateGoalController from "./updateGoalController";
import UpdateLogbookController from "./updateLogbookController";
import UpdateLogController from "./updateLogController";

export const createCategoryController = new CreateCategoryController(
  createCategoryImpl
);

export const createLogbookController = new CreateLogbookController(
  createLogbookImpl
);

export const createLogController = new CreateLogController(createLogImpl);

export const createGoalController = new CreateGoalController(
  createGoalImpl,
  dateServiceImpl
);

export const getLogbookController = new GetLogbookController(getLogbookImpl);

export const updateGoalController = new UpdateGoalController(updateGoalImpl);

export const updateLogController = new UpdateLogController(updateLogImpl);

export const deleteLogController = new DeleteLogController(deleteLogImpl);

export const getLogsController = new GetLogsController(
  getLogsImpl,
  dateServiceImpl
);

export const updateLogbookController = new UpdateLogbookController(
  updateLogbookImpl
);

export const getRewardsController = new GetRewardsController(getRewardsImpl);

export const getLogbooksController = new GetLogbooksController(getLogbooksImpl);

export const deleteCategoryController = new DeleteCategoryController(
  deleteCategoryImpl
);

export const deleteLogbookController = new DeleteLogbookController(
  deleteLogbookImpl
);
