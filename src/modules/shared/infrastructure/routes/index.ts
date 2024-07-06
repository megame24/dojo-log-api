import express from "express";
import { authenticateUserMiddleware } from "../../../users/adapters/middleware";
import userModuleRouter from "../../../users/infrastructure/routes";
import logbookModuleRouter from "../../../logbook/infrastructure/routes";
import mailingListModuleRouter from "../../../mailingList/infrastructure/routes";
import userGoalNotificationModuleRouter from "../../../userNotification/infrastructure/routes";

// TODO: Version routes!!!!

const appRouter = express.Router();

appRouter.use(authenticateUserMiddleware.execute);

appRouter.use(userModuleRouter);
appRouter.use(logbookModuleRouter);
appRouter.use(mailingListModuleRouter);
appRouter.use(userGoalNotificationModuleRouter);

export default appRouter;
