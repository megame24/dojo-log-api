import {
  dateServiceImpl,
  uuidServiceImpl,
} from "../../shared/infrastructure/services";
import {
  categoryRepoImpl,
  logbookRepoImpl,
} from "../infrastructure/repositories";
import { CreateCategoryImpl } from "./createCategory";
import { CreateLogbookImpl } from "./createLogbook";

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
