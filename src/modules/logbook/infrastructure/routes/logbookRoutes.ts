import express from "express";
import multer from "multer";
import { Operation } from "../../../shared/accessControl";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import { logbookAccessControl } from "../../accessControl";
import {
  createGoalController,
  createLogbookController,
  deleteLogbookController,
  deleteLogController,
  getEarliestLogbookYearController,
  getLogbookController,
  getLogbooksController,
  getLogsController,
  updateGoalController,
  updateLogbookController,
  updateLogController,
  createLogController,
  getGoalController,
  saveLogbookNotificationsController,
  getLogbookNotificationController,
  deleteLogbookNotificationsController,
} from "../../adapters/controllers";
import {
  getGoalImpl,
  getLiteLogbookImpl,
  getLiteRewardsImpl,
  getLogImpl,
} from "../../useCases";
import endpointPolicy from "./endpointPolicy.json";
import { updateLogbookMiddleware } from "../../adapters/middleware";

const logbookRouter = express.Router();

logbookRouter.post(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "logbooks",
    resourcesForAccessCheck: [],
  }),
  createLogbookController.execute
);

logbookRouter.get(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET_MANY,
    resourceType: "logbooks",
    resourcesForAccessCheck: [], // EXPLORE USING THIS TO GET USER BY USERNAME AND PASS ID
    // TO ENABLE US HAVE A URL LIKE: "/:username/logbooks" (alternatively, have a facade url)
  }),
  getLogbooksController.execute
);

logbookRouter.get(
  "/earliestLogbookYear",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET_ONE,
    resourceType: "earliestLogbookYear",
    resourcesForAccessCheck: [],
  }),
  getEarliestLogbookYearController.execute
);

logbookRouter.get(
  "/:logbookId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET_ONE,
    resourceType: "logbooks",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
    ],
  }),
  getLogbookController.execute
);

logbookRouter.put(
  "/:logbookId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.UPDATE,
    resourceType: "logbooks",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
    ],
  }),
  updateLogbookController.execute
);

logbookRouter.delete(
  "/:logbookId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.DELETE,
    resourceType: "logbooks",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
    ],
  }),
  deleteLogbookController.execute
);

logbookRouter.post(
  "/:logbookId/logs",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  multer().any(),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "logs",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
    ],
  }),
  createLogController.execute,
  updateLogbookMiddleware.execute
);

logbookRouter.get(
  "/:logbookId/logs",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET_MANY,
    resourceType: "logs",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
    ],
  }),
  getLogsController.execute
);

logbookRouter.put(
  "/:logbookId/logs/:logId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  multer().any(),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.UPDATE,
    resourceType: "logs",
    resourcesForAccessCheck: [{ name: "log", getResource: getLogImpl }],
  }),
  updateLogController.execute,
  updateLogbookMiddleware.execute
);

logbookRouter.delete(
  "/:logbookId/logs/:logId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.DELETE,
    resourceType: "logs",
    resourcesForAccessCheck: [{ name: "log", getResource: getLogImpl }],
  }),
  deleteLogController.execute,
  updateLogbookMiddleware.execute
);

logbookRouter.post(
  "/:logbookId/goals",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  multer().any(),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "goals",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
      { name: "rewards", getResource: getLiteRewardsImpl },
    ],
  }),
  createGoalController.execute,
  updateLogbookMiddleware.execute
);

logbookRouter.get(
  "/:logbookId/goals/:goalId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET_ONE,
    resourceType: "goals",
    resourcesForAccessCheck: [{ name: "goal", getResource: getGoalImpl }],
  }),
  getGoalController.execute
);

logbookRouter.put(
  "/:logbookId/goals/:goalId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  multer().any(),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.UPDATE,
    resourceType: "goals",
    resourcesForAccessCheck: [
      { name: "goal", getResource: getGoalImpl },
      { name: "rewards", getResource: getLiteRewardsImpl },
    ],
  }),
  updateGoalController.execute,
  updateLogbookMiddleware.execute
);

logbookRouter.put(
  "/:logbookId/notifications",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.UPDATE,
    resourceType: "logbookNotifications",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
    ],
  }),
  saveLogbookNotificationsController.execute
);

logbookRouter.get(
  "/:logbookId/notifications",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET_ONE,
    resourceType: "logbookNotifications",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
    ],
  }),
  getLogbookNotificationController.execute
);

logbookRouter.delete(
  "/:logbookId/notifications",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.DELETE,
    resourceType: "logbookNotifications",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
    ],
  }),
  deleteLogbookNotificationsController.execute
);

export default logbookRouter;
