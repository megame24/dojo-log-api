import express from "express";
import userNotificationRouter from "./userNotificationRoutes";

const userNotificationModuleRouter = express.Router();

userNotificationModuleRouter.use("", userNotificationRouter);

export default userNotificationModuleRouter;
