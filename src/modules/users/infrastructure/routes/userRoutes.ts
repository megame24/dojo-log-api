import express from "express";
import { endpointPermissionsMiddleware } from "../../../shared/adapters/middleware";
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

const userRouter = express.Router();

userRouter.post(
  "/register",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  registerUserController.execute,
  sendVerificationMiddleware.execute
);

userRouter.post(
  "/login",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  loginUserController.execute
);

userRouter.put(
  "/:userId/verify",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  verifyUserController.execute
);

userRouter.get(
  "/:userId/send-verification",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  sendVerificationController.execute
);

userRouter.post(
  "/forgot-password",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  forgotPasswordController.execute
);

userRouter.put(
  "/:userId/reset-password",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  resetPasswordController.execute
);

export default userRouter;
