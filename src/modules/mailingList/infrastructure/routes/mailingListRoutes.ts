import express from "express";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import {
  addMailToMailingListController,
  sendMailToAllSubscribersController,
  unsubscribeFromMailingListController,
} from "../../adapters/controllers";
import endpointPolicy from "./endpointPolicy.json";
import { mailingListAccessControl } from "../../accessControl";
import { Operation } from "../../../shared/accessControl";
import { sendSubscribedToMailingListEmailMiddleware } from "../../adapters/middleware";

const userRouter = express.Router();

// apply cors to these endpoints

userRouter.post(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: mailingListAccessControl,
    operation: Operation.CREATE,
    resourceType: "mailingList",
    resourcesForAccessCheck: [],
  }),
  addMailToMailingListController.execute,
  sendSubscribedToMailingListEmailMiddleware.execute
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

userRouter.post(
  "/subscribers",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: mailingListAccessControl,
    operation: Operation.CREATE,
    resourceType: "subscribers",
    resourcesForAccessCheck: [],
  }),
  sendMailToAllSubscribersController.execute
);

export default userRouter;
