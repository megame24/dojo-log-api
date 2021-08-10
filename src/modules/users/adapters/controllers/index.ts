import {
  loginUserViaEmailImpl,
  registerUserViaEmailImpl,
  sendVerificationImpl,
  verifyUserImpl,
} from "../../useCases";
import RegisterUserViaEmailController from "./registerUserViaEmailController";
import LoginUserViaEmailController from "./loginUserViaEmailController";
import VerifyUserController from "./verifyUserController";
import SendVerificationController from "./sendVerificationController";

export const registerUserViaEmailController =
  new RegisterUserViaEmailController(registerUserViaEmailImpl);

export const loginUserViaEmailController = new LoginUserViaEmailController(
  loginUserViaEmailImpl
);

export const verifyUserController = new VerifyUserController(verifyUserImpl);

export const sendVerificationController = new SendVerificationController(
  sendVerificationImpl
);
