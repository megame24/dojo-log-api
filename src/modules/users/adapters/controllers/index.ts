import {
  forgotPasswordImpl,
  loginUserViaEmailImpl,
  registerUserViaEmailImpl,
  sendVerificationImpl,
  verifyUserImpl,
} from "../../useCases";
import RegisterUserViaEmailController from "./registerUserViaEmailController";
import LoginUserViaEmailController from "./loginUserViaEmailController";
import VerifyUserController from "./verifyUserController";
import SendVerificationController from "./sendVerificationController";
import ForgotPasswordController from "./forgotPasswordController";

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
