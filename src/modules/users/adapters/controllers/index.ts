import {
  forgotPasswordImpl,
  getUserImpl,
  loginUserImpl,
  registerUserImpl,
  resetPasswordImpl,
  sendVerificationImpl,
  verifyUserImpl,
} from "../../useCases";
import RegisterUserController from "./registerUserController";
import LoginUserController from "./loginUserController";
import VerifyUserController from "./verifyUserController";
import SendVerificationController from "./sendVerificationController";
import ForgotPasswordController from "./forgotPasswordController";
import ResetPasswordController from "./resetPasswordController";
import GetUserProfileController from "./getUserProfileController";

export const registerUserController = new RegisterUserController(
  registerUserImpl
);

export const loginUserController = new LoginUserController(loginUserImpl);

export const verifyUserController = new VerifyUserController(verifyUserImpl);

export const sendVerificationController = new SendVerificationController(
  sendVerificationImpl
);

export const forgotPasswordController = new ForgotPasswordController(
  forgotPasswordImpl
);

export const resetPasswordController = new ResetPasswordController(
  resetPasswordImpl
);

export const getUserProfileController = new GetUserProfileController();
