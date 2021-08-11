import {
  forgotPasswordImpl,
  loginUserViaEmailImpl,
  registerUserViaEmailImpl,
  resetPasswordImpl,
  sendVerificationImpl,
  verifyUserImpl,
} from "../../useCases";
import RegisterUserViaEmailController from "./registerUserViaEmailController";
import LoginUserViaEmailController from "./loginUserViaEmailController";
import VerifyUserController from "./verifyUserController";
import SendVerificationController from "./sendVerificationController";
import ForgotPasswordController from "./forgotPasswordController";
import ResetPasswordController from "./resetPasswordController";

export const registerUserViaEmailController =
  new RegisterUserViaEmailController(registerUserViaEmailImpl);

export const loginUserViaEmailController = new LoginUserViaEmailController(
  loginUserViaEmailImpl
);

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
