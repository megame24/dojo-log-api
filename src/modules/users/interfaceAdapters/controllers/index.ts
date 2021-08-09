import {
  loginUserViaEmailImpl,
  registerUserViaEmailImpl,
  verifyUserImpl,
} from "../../useCases";
import RegisterUserViaEmailController from "./registerUserViaEmailController";
import LoginUserViaEmailController from "./loginUserViaEmailController";
import VerifyUserController from "./verifyUserController";

export const registerUserViaEmailController =
  new RegisterUserViaEmailController(registerUserViaEmailImpl);

export const loginUserViaEmailController = new LoginUserViaEmailController(
  loginUserViaEmailImpl
);

export const verifyUserController = new VerifyUserController(verifyUserImpl);
