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

const mailingListRouter = express.Router();

// apply cors to these endpoints

mailingListRouter.post(
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

mailingListRouter.put(
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

mailingListRouter.post(
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

export default mailingListRouter;
