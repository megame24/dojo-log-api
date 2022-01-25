import express from "express";
import { Operation } from "../../../shared/accessControl";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import { logbookAccessControl } from "../../accessControl";
import { getRewardsController } from "../../adapters/controllers";
import endpointPolicy from "./endpointPolicy.json";

const rewardRouter = express.Router();

rewardRouter.get(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET,
    resourceType: "rewards",
    resourcesForAccessCheck: [],
  }),
  getRewardsController.execute
);

export default rewardRouter;
