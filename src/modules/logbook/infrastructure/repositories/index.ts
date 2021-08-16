import models from "../../../shared/infrastructure/database/models";
import { uuidServiceImpl } from "../../../shared/infrastructure/services";
import { CategoryRepoImpl } from "./categoryRepo";

const { Category } = <any>models;

export const categoryRepoImpl = new CategoryRepoImpl(Category, uuidServiceImpl);
