import express from "express";
import userGoalNotificationRouter from "./userGoalNotificationRoutes";

const userGoalNotificationModuleRouter = express.Router();

userGoalNotificationModuleRouter.use(
  "/user-goal-notifications",
  userGoalNotificationRouter
);

export default userGoalNotificationModuleRouter;
