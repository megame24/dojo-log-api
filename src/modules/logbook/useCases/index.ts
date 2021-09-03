import {
  fileServiceImpl,
  uuidServiceImpl,
} from "../../shared/infrastructure/services";
import {
  categoryRepoImpl,
  logbookRepoImpl,
  logRepoImpl,
} from "../infrastructure/repositories";
import { dateServiceImpl } from "../infrastructure/services";
import { CreateCategoryImpl } from "./createCategory";
import { CreateLogImpl } from "./createLog";
import { CreateLogbookImpl } from "./createLogbook";
import { GetLiteLogbookImpl } from "./getLiteLogbook";

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
