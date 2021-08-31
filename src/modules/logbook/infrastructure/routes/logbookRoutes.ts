import express from "express";
import { Operation } from "../../../shared/accessControl";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import { logBookAccessControl } from "../../accessControl";
import { createLogbookController } from "../../adapters/controllers";
import endpointPolicy from "./endpointPolicy.json";

const logbookRouter = express.Router();

logbookRouter.post(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logBookAccessControl,
    operation: Operation.CREATE,
    resourceType: "logbook",
  }),
  createLogbookController.execute
);

export default logbookRouter;
