import express from "express";
import {
  userModuleRouter,
  authenticateUserMiddleware,
} from "../../../users/api";
import { logbookModuleRouter } from "../../../logbook/api";

const appRouter = express.Router();

appRouter.use(authenticateUserMiddleware.execute);
appRouter.use(userModuleRouter);
appRouter.use(logbookModuleRouter);

export default appRouter;
