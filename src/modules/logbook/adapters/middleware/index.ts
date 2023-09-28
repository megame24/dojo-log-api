import { updateLogbookImpl } from "../../useCases";
import UpdateLogbookMiddleware from "./updateLogbookMiddleware";

export const updateLogbookMiddleware = new UpdateLogbookMiddleware(
  updateLogbookImpl
);
