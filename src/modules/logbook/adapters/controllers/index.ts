import { dateServiceImpl } from "../../infrastructure/services";
import {
  createCategoryImpl,
  createGoalImpl,
  createLogbookImpl,
  createLogImpl,
  deleteLogImpl,
  getLogbookImpl,
  updateGoalImpl,
  updateLogImpl,
} from "../../useCases";
import CreateCategoryController from "./createCategoryController";
import CreateGoalController from "./createGoalController";
import CreateLogbookController from "./createLogbookController";
import CreateLogController from "./createLogController";
import DeleteLogController from "./deleteLogController";
import GetLogbookController from "./getLogbookController";
import UpdateGoalController from "./updateGoalController";
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
