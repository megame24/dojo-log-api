import express from "express";
import { Operation } from "../../../shared/accessControl";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import { logbookAccessControl } from "../../accessControl";
import {
  batchDeleteGoalNotificationsController,
  batchUpdateGoalNotificationsController,
} from "../../adapters/controllers";
import endpointPolicy from "./endpointPolicy.json";

const goalNotificationRouter = express.Router();

goalNotificationRouter.put(
  "/batch-update",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.UPDATE,
    resourceType: "goalNotifications",
    resourcesForAccessCheck: [],
  }),
  batchUpdateGoalNotificationsController.execute
);

goalNotificationRouter.put(
  "/batch-delete",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.DELETE,
    resourceType: "goalNotifications",
    resourcesForAccessCheck: [],
  }),
  batchDeleteGoalNotificationsController.execute
);

export default goalNotificationRouter;
