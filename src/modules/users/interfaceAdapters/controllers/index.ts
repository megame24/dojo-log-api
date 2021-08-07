import RegisterUserViaEmailController from "./registerUserViaEmailController";
import { registerUserViaEmailImpl } from "../../useCases";

export const registerUserViaEmailController =
  new RegisterUserViaEmailController(registerUserViaEmailImpl);
