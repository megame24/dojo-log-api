import express from "express";
import {
  registerUserViaEmailController,
  loginUserViaEmailController,
  verifyUserController,
  sendVerificationController,
  forgotPasswordController,
  resetPasswordController,
} from "../../adapters/controllers";
import {
  checkEndpointPermissionsMiddleware,
  sendVerificationMiddleware,
} from "../../adapters/middleware";
import endpointPolicy from "../services/security/endpointPolicy.json";

const userRouter = express.Router();

userRouter.post(
  "/register",
  checkEndpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  registerUserViaEmailController.execute,
  sendVerificationMiddleware.execute
);

userRouter.post(
  "/login",
  checkEndpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  loginUserViaEmailController.execute
);

userRouter.put(
  "/:id/verify/:token",
  checkEndpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  verifyUserController.execute
);

userRouter.get(
  "/:id/send-verification",
  checkEndpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  sendVerificationController.execute
);

userRouter.post(
  "/forgot-password",
  checkEndpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  forgotPasswordController.execute
);

userRouter.put(
  "/:id/reset-password/:token",
  checkEndpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  resetPasswordController.execute
);

export { userRouter };
