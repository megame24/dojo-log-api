import {
  securityServiceImpl,
  uuidServiceImpl,
} from "../infrastructure/services";
import {
  persistentTokenRepoImpl,
  userRepoImpl,
} from "../infrastructure/repositories";
import { RegisterUserViaEmailImpl } from "./registerUserViaEmail";
import { emailServiceImpl } from "../../shared/infrastructure/services";
import { LoginUserViaEmailImpl } from "./loginUserViaEmail";
import { VerifyUserImpl } from "./verifyUser";

export const registerUserViaEmailImpl = new RegisterUserViaEmailImpl(
  securityServiceImpl,
  uuidServiceImpl,
  userRepoImpl,
  emailServiceImpl,
  persistentTokenRepoImpl
);

export const loginUserViaEmailImpl = new LoginUserViaEmailImpl(
  securityServiceImpl,
  userRepoImpl
);

export const verifyUserImpl = new VerifyUserImpl(
  userRepoImpl,
  persistentTokenRepoImpl,
  securityServiceImpl
);
