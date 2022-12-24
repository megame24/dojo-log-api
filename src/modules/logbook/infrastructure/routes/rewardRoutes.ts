import express from "express";
import multer from "multer";
import { Operation } from "../../../shared/accessControl";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import { logbookAccessControl } from "../../accessControl";
import {
  createRewardController,
  deleteRewardController,
  getRewardsController,
  updateRewardController,
} from "../../adapters/controllers";
import { getRewardImpl } from "../../useCases";
import endpointPolicy from "./endpointPolicy.json";

const rewardRouter = express.Router();

rewardRouter.post(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  multer().any(),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "rewards",
    resourcesForAccessCheck: [],
  }),
  createRewardController.execute
);

rewardRouter.put(
  "/:rewardId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  multer().any(),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.UPDATE,
    resourceType: "rewards",
    resourcesForAccessCheck: [{ name: "reward", getResource: getRewardImpl }],
  }),
  updateRewardController.execute
);

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
