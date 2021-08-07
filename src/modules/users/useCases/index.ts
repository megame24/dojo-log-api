import {
  securityServiceImpl,
  uuidServiceImpl,
} from "../infrastructure/services";
import { userRepoImpl } from "../infrastructure/repositories";
import { RegisterUserViaEmailImpl } from "./registerUserViaEmail";
import { emailServiceImpl } from "../../shared/infrastructure/services";
import { LoginUserViaEmailImpl } from "./loginUserViaEmail";

export const registerUserViaEmailImpl = new RegisterUserViaEmailImpl(
  securityServiceImpl,
  uuidServiceImpl,
  userRepoImpl,
  emailServiceImpl
);
export const loginUserViaEmailImpl = new LoginUserViaEmailImpl(
  securityServiceImpl,
  userRepoImpl
);
