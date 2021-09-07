import {
  createCategoryImpl,
  createGoalImpl,
  createLogbookImpl,
  createLogImpl,
} from "../../useCases";
import CreateCategoryController from "./createCategoryController";
import CreateGoalController from "./createGoalController";
import CreateLogbookController from "./createLogbookController";
import CreateLogController from "./createLogController";

export const createCategoryController = new CreateCategoryController(
  createCategoryImpl
);

export const createLogbookController = new CreateLogbookController(
  createLogbookImpl
);

export const createLogController = new CreateLogController(createLogImpl);

export const createGoalController = new CreateGoalController(createGoalImpl);
