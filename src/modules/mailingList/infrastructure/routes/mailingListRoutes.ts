import express from "express";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import {
  addMailToMailingListController,
  unsubscribeFromMailingListController,
} from "../../adapters/controllers";
import endpointPolicy from "./endpointPolicy.json";
import { mailingListAccessControl } from "../../accessControl";
import { Operation } from "../../../shared/accessControl";

const userRouter = express.Router();

userRouter.post(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: mailingListAccessControl,
    operation: Operation.CREATE,
    resourceType: "mailingList",
    resourcesForAccessCheck: [],
  }),
  addMailToMailingListController.execute
);

userRouter.put(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: mailingListAccessControl,
    operation: Operation.UPDATE,
    resourceType: "mailingList",
    resourcesForAccessCheck: [],
  }),
  unsubscribeFromMailingListController.execute
);

export default userRouter;
