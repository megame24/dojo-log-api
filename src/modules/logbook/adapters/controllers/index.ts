import {
  createCategoryImpl,
  createLogbookImpl,
  createLogImpl,
} from "../../useCases";
import CreateCategoryController from "./createCategoryController";
import CreateLogbookController from "./createLogbookController";
import CreateLogController from "./createLogController";

export const createCategoryController = new CreateCategoryController(
  createCategoryImpl
);
export const createLogbookController = new CreateLogbookController(
  createLogbookImpl
);
export const createLogController = new CreateLogController(createLogImpl);
