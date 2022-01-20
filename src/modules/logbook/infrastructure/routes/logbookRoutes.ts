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
  deleteLogController,
  getLogbookController,
  getLogsController,
  updateGoalController,
  updateLogbookController,
  updateLogController,
} from "../../adapters/controllers";
import { createLogController } from "../../adapters/controllers";
import {
  getGoalImpl,
  getLiteLogbookImpl,
  getLiteRewardsImpl,
  getLogImpl,
} from "../../useCases";
import endpointPolicy from "./endpointPolicy.json";

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
  "/:logbookId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET,
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
  createLogController.execute
);

logbookRouter.get(
  "/:logbookId/logs",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET,
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
  updateLogController.execute
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
  deleteLogController.execute
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
  createGoalController.execute
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
  updateGoalController.execute
);

export default logbookRouter;
