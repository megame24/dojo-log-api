import express from "express";
import {
  userModuleRouter,
  authenticateUserMiddleware,
} from "../../../users/api";

const appRouter = express.Router();

appRouter.use(authenticateUserMiddleware.execute);
appRouter.use(userModuleRouter);

export default appRouter;
