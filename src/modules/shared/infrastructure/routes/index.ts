import express from "express";
import { authenticateUserMiddleware } from "../../../users/adapters/middleware";
import userModuleRouter from "../../../users/infrastructure/routes";
import logbookModuleRouter from "../../../logbook/infrastructure/routes";

// TODO: Version routes!!!!

const appRouter = express.Router();

appRouter.use(authenticateUserMiddleware.execute);

appRouter.use(userModuleRouter);
appRouter.use(logbookModuleRouter);

export default appRouter;
