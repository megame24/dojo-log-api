import {
  loginUserViaEmailImpl,
  registerUserViaEmailImpl,
} from "../../useCases";
import RegisterUserViaEmailController from "./registerUserViaEmailController";
import LoginUserViaEmailController from "./loginUserViaEmailController";

export const registerUserViaEmailController =
  new RegisterUserViaEmailController(registerUserViaEmailImpl);
export const loginUserViaEmailController = new LoginUserViaEmailController(
  loginUserViaEmailImpl
);
