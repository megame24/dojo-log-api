import express from "express";
import { endpointPermissionsMiddleware } from "../../../shared/adapters/middleware";
import {
  registerUserViaEmailController,
  loginUserViaEmailController,
  verifyUserController,
  sendVerificationController,
  forgotPasswordController,
  resetPasswordController,
} from "../../adapters/controllers";
import { sendVerificationMiddleware } from "../../adapters/middleware";
import endpointPolicy from "./endpointPolicy.json";

const userRouter = express.Router();

userRouter.post(
  "/register",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  registerUserViaEmailController.execute,
  sendVerificationMiddleware.execute
);

userRouter.post(
  "/login",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  loginUserViaEmailController.execute
);

userRouter.put(
  "/verify",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  verifyUserController.execute
);

userRouter.get(
  "/send-verification",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  sendVerificationController.execute
);

userRouter.post(
  "/forgot-password",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  forgotPasswordController.execute
);

userRouter.put(
  "/:userId/reset-password/:token",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  resetPasswordController.execute
);

export default userRouter;
