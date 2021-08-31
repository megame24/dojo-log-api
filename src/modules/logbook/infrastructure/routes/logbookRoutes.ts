import express from "express";
import { endpointPermissionsMiddleware } from "../../../shared/adapters/middleware";
import { createLogbookController } from "../../adapters/controllers";
import endpointPolicy from "./endpointPolicy.json";

const logbookRouter = express.Router();

logbookRouter.post(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  // IMPLEMENT ATTRIBUTE BASED PERMISSIONS HERE!!!!
  createLogbookController.execute
);
