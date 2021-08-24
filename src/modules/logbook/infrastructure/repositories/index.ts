import models from "../../../shared/infrastructure/database/models";
import { uuidServiceImpl } from "../../../shared/infrastructure/services";
import { CategoryRepoImpl } from "./categoryRepo";
import { LogbookRepoImpl } from "./logbookRepo";

const { Category, Logbook } = <any>models;

export const categoryRepoImpl = new CategoryRepoImpl(Category, uuidServiceImpl);
export const logbookRepoImpl = new LogbookRepoImpl(Logbook);
