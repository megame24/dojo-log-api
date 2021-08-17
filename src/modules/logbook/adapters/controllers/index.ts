import { createCategoryImpl } from "../../useCases";
import CreateCategoryController from "./createCategoryController";

export const createCategoryController = new CreateCategoryController(
  createCategoryImpl
);
