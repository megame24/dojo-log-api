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
  getUserProfileController,
  updateUserProfileController,
  googleSignInVerifyController,
  changePasswordController,
  deleteAccountController,
} from "../../adapters/controllers";
import { sendVerificationMiddleware } from "../../adapters/middleware";
import endpointPolicy from "./endpointPolicy.json";
import { userAccessControl } from "../../accessControl";
import { Operation } from "../../../shared/accessControl";
import { getUserImpl } from "../../useCases";
import { addMailToMailingListMiddleware } from "../../../mailingList/adapters/middleware";

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
  sendVerificationMiddleware.execute,
  addMailToMailingListMiddleware.execute
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

userRouter.post(
  "/google-sign-in-verify",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userAccessControl,
    operation: Operation.CREATE,
    resourceType: "googleSignInVerify",
    resourcesForAccessCheck: [],
  }),
  googleSignInVerifyController.execute,
  addMailToMailingListMiddleware.execute
);

userRouter.get(
  "/:userId/profile",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userAccessControl,
    operation: Operation.GET_ONE,
    resourceType: "profile",
    resourcesForAccessCheck: [{ name: "user", getResource: getUserImpl }],
  }),
  getUserProfileController.execute
);

userRouter.put(
  "/:userId/profile",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userAccessControl,
    operation: Operation.UPDATE,
    resourceType: "profile",
    resourcesForAccessCheck: [{ name: "user", getResource: getUserImpl }],
  }),
  updateUserProfileController.execute
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

userRouter.put(
  "/:userId/change-password",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userAccessControl,
    operation: Operation.UPDATE,
    resourceType: "changePassword",
    resourcesForAccessCheck: [{ name: "user", getResource: getUserImpl }],
  }),
  changePasswordController.execute
);

userRouter.delete(
  "/:userId/account",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: userAccessControl,
    operation: Operation.DELETE,
    resourceType: "deleteAccount",
    resourcesForAccessCheck: [{ name: "user", getResource: getUserImpl }],
  }),
  deleteAccountController.execute
);

export default userRouter;
