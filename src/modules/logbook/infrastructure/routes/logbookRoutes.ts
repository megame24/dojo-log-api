import express from "express";
import { Operation } from "../../../shared/accessControl";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import { logbookAccessControl } from "../../accessControl";
import { createLogbookController } from "../../adapters/controllers";
import { createLogController } from "../../adapters/controllers";
import { getLiteLogbookImpl } from "../../useCases";
import endpointPolicy from "./endpointPolicy.json";

const logbookRouter = express.Router();

logbookRouter.post(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "logbook",
  }),
  createLogbookController.execute
);

logbookRouter.post(
  "/:logbookId/log",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "log",
    getResourceOrParent: getLiteLogbookImpl,
  }),
  createLogController.execute
);

export default logbookRouter;
