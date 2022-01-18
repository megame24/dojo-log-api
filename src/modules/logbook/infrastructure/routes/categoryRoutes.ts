import express from "express";
import { Operation } from "../../../shared/accessControl";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import { logbookAccessControl } from "../../accessControl";
import { createCategoryController } from "../../adapters/controllers";
import endpointPolicy from "./endpointPolicy.json";

const categoryRouter = express.Router();

categoryRouter.post(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "categories",
    resourcesForAccessCheck: [],
  }),
  createCategoryController.execute
);

export default categoryRouter;
