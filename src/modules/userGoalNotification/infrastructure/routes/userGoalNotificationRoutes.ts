import express from "express";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import endpointPolicy from "./endpointPolicy.json";
import { userGoalNotificationAccessControl } from "../../accessControl";
import { Operation } from "../../../shared/accessControl";
import { getUserGoalNotificationsController } from "../../adapters/controllers";

const userGoalNotificationRouter = express.Router();

userGoalNotificationRouter.get(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userGoalNotificationAccessControl,
    operation: Operation.GET_MANY,
    resourceType: "userGoalNotifications",
    resourcesForAccessCheck: [],
  }),
  getUserGoalNotificationsController.execute
);

export default userGoalNotificationRouter;
