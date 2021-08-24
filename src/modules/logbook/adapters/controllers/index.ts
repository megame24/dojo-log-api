import { createCategoryImpl, createLogbookImpl } from "../../useCases";
import CreateCategoryController from "./createCategoryController";
import CreateLogbookController from "./createLogbookController";

export const createCategoryController = new CreateCategoryController(
  createCategoryImpl
);
export const createLogbookController = new CreateLogbookController(
  createLogbookImpl
);
