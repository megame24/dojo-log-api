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
  getLogbookController,
  updateGoalController,
  updateLogController,
} from "../../adapters/controllers";
import { createLogController } from "../../adapters/controllers";
import {
  getLiteGoalImpl,
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
    resourceType: "logbook",
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
    resourceType: "logbook",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
    ],
  }),
  getLogbookController.execute
);

logbookRouter.post(
  "/:logbookId/log",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  multer().any(),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "log",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
    ],
  }),
  createLogController.execute
);

logbookRouter.put(
  "/:logbookId/log/:logId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  multer().any(),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.UPDATE,
    resourceType: "log",
    resourcesForAccessCheck: [{ name: "log", getResource: getLogImpl }],
  }),
  updateLogController.execute
);

logbookRouter.post(
  "/:logbookId/goal",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  multer().any(),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "goal",
    resourcesForAccessCheck: [
      { name: "logbook", getResource: getLiteLogbookImpl },
      { name: "rewards", getResource: getLiteRewardsImpl },
    ],
  }),
  createGoalController.execute
);

logbookRouter.put(
  "/:logbookId/goal/:goalId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  multer().any(),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.UPDATE,
    resourceType: "goal",
    resourcesForAccessCheck: [
      { name: "goal", getResource: getLiteGoalImpl },
      { name: "rewards", getResource: getLiteRewardsImpl },
    ],
  }),
  updateGoalController.execute
);

export default logbookRouter;
