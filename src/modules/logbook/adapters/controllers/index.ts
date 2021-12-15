import {
  createCategoryImpl,
  createGoalImpl,
  createLogbookImpl,
  createLogImpl,
  getLogbookImpl,
  updateGoalImpl,
} from "../../useCases";
import CreateCategoryController from "./createCategoryController";
import CreateGoalController from "./createGoalController";
import CreateLogbookController from "./createLogbookController";
import CreateLogController from "./createLogController";
import GetLogbookController from "./getLogbookController";
import UpdateGoalController from "./updateGoalController";

export const createCategoryController = new CreateCategoryController(
  createCategoryImpl
);

export const createLogbookController = new CreateLogbookController(
  createLogbookImpl
);

export const createLogController = new CreateLogController(createLogImpl);

export const createGoalController = new CreateGoalController(createGoalImpl);

export const getLogbookController = new GetLogbookController(getLogbookImpl);

export const updateGoalController = new UpdateGoalController(updateGoalImpl);
