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
  endpointPermissionsMiddleware,
  sendVerificationMiddleware,
} from "../../adapters/middleware";
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
  "/:id/verify/:token",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  verifyUserController.execute
);

userRouter.get(
  "/:id/send-verification",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  sendVerificationController.execute
);

userRouter.post(
  "/forgot-password",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  forgotPasswordController.execute
);

userRouter.put(
  "/:id/reset-password/:token",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  resetPasswordController.execute
);

export default userRouter;
