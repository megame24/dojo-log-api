import express from "express";
import { Operation } from "../../../shared/accessControl";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import { logbookAccessControl } from "../../accessControl";
import {
  deleteRewardController,
  getRewardsController,
} from "../../adapters/controllers";
import { getRewardImpl } from "../../useCases";
import endpointPolicy from "./endpointPolicy.json";

const rewardRouter = express.Router();

rewardRouter.get(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET_MANY,
    resourceType: "rewards",
    resourcesForAccessCheck: [],
  }),
  getRewardsController.execute
);

rewardRouter.delete(
  "/:rewardId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.DELETE,
    resourceType: "rewards",
    resourcesForAccessCheck: [{ name: "reward", getResource: getRewardImpl }],
  }),
  deleteRewardController.execute
);

export default rewardRouter;
