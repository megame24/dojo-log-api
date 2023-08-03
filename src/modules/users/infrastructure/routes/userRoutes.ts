import express from "express";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import {
  registerUserController,
  loginUserController,
  verifyUserController,
  sendVerificationController,
  forgotPasswordController,
  resetPasswordController,
} from "../../adapters/controllers";
import { sendVerificationMiddleware } from "../../adapters/middleware";
import endpointPolicy from "./endpointPolicy.json";
import { userAccessControl } from "../../accessControl";
import { Operation } from "../../../shared/accessControl";
import { getUserImpl } from "../../useCases";

const userRouter = express.Router();

userRouter.post(
  "/register",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userAccessControl,
    operation: Operation.CREATE,
    resourceType: "register",
    resourcesForAccessCheck: [],
  }),
  registerUserController.execute,
  sendVerificationMiddleware.execute
);

userRouter.post(
  "/login",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userAccessControl,
    operation: Operation.CREATE,
    resourceType: "login",
    resourcesForAccessCheck: [],
  }),
  loginUserController.execute
);

userRouter.put(
  "/:userId/verify",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userAccessControl,
    operation: Operation.UPDATE,
    resourceType: "verify",
    resourcesForAccessCheck: [],
  }),
  verifyUserController.execute
);

userRouter.get(
  "/:userId/send-verification",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userAccessControl,
    operation: Operation.GET_ONE,
    resourceType: "sendVerification",
    resourcesForAccessCheck: [{ name: "user", getResource: getUserImpl }],
  }),
  sendVerificationController.execute
);

userRouter.post(
  "/forgot-password",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userAccessControl,
    operation: Operation.CREATE,
    resourceType: "forgotPassword",
    resourcesForAccessCheck: [],
  }),
  forgotPasswordController.execute
);

userRouter.put(
  "/:userId/reset-password",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userAccessControl,
    operation: Operation.UPDATE,
    resourceType: "resetPassword",
    resourcesForAccessCheck: [],
  }),
  resetPasswordController.execute
);

export default userRouter;
