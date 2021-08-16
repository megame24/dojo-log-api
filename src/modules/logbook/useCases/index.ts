import { uuidServiceImpl } from "../../shared/infrastructure/services";
import { categoryRepoImpl } from "../infrastructure/repositories";
import { CreateCategoryImpl } from "./createCategory";

export const createCategoryImpl = new CreateCategoryImpl(
  categoryRepoImpl,
  uuidServiceImpl
);
