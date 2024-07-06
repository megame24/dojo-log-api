import express from "express";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import endpointPolicy from "./endpointPolicy.json";
import { userNotificationAccessControl } from "../../accessControl";
import { Operation } from "../../../shared/accessControl";
import {
  getUserGoalNotificationsController,
  getUserLogbookNotificationsController,
} from "../../adapters/controllers";

const userNotificationRouter = express.Router();

userNotificationRouter.get(
  "/user-goal-notifications",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userNotificationAccessControl,
    operation: Operation.GET_MANY,
    resourceType: "userGoalNotifications",
    resourcesForAccessCheck: [],
  }),
  getUserGoalNotificationsController.execute
);

userNotificationRouter.get(
  "/user-logbook-notifications",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userNotificationAccessControl,
    operation: Operation.GET_MANY,
    resourceType: "userLogbookNotifications",
    resourcesForAccessCheck: [],
  }),
  getUserLogbookNotificationsController.execute
);

export default userNotificationRouter;
