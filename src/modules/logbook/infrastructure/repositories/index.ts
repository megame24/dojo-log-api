import models from "../../../shared/infrastructure/database/models";
import { uuidServiceImpl } from "../../../shared/infrastructure/services";
import { dateServiceImpl } from "../services";
import { CategoryRepoImpl } from "./categoryRepo";
import { LogbookRepoImpl } from "./logbookRepo";
import { LogRepoImpl } from "./logRepo";

const { Category, Logbook, Log } = <any>models;

export const categoryRepoImpl = new CategoryRepoImpl(Category, uuidServiceImpl);
export const logbookRepoImpl = new LogbookRepoImpl(
  Logbook,
  Category,
  uuidServiceImpl,
  dateServiceImpl
);
export const logRepoImpl = new LogRepoImpl(Log);
