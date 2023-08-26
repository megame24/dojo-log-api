import express from "express";
import { Operation } from "../../../shared/accessControl";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import { logbookAccessControl } from "../../accessControl";
import {
  deleteFileController,
  downloadFileController,
} from "../../adapters/controllers";
import { getFileImpl } from "../../useCases";
import endpointPolicy from "./endpointPolicy.json";

const fileRouter = express.Router();

fileRouter.delete(
  "/:fileId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.DELETE,
    resourceType: "files",
    resourcesForAccessCheck: [{ name: "file", getResource: getFileImpl }],
  }),
  deleteFileController.execute
);

fileRouter.get(
  "/:fileId/download",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET_ONE,
    resourceType: "files",
    resourcesForAccessCheck: [{ name: "file", getResource: getFileImpl }],
  }),
  downloadFileController.execute
);

export default fileRouter;
