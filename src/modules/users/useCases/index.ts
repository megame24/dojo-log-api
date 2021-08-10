import {
  securityServiceImpl,
  uuidServiceImpl,
} from "../infrastructure/services";
import {
  persistentTokenRepoImpl,
  userRepoImpl,
} from "../infrastructure/repositories";
import { RegisterUserViaEmailImpl } from "./registerUserViaEmail";
import { LoginUserViaEmailImpl } from "./loginUserViaEmail";
import { VerifyUserImpl } from "./verifyUser";
import { AuthenticateUserImpl } from "./authenticateUser";
import { SendVerificationImpl } from "./sendVerification";
import { emailServiceImpl } from "../../shared/infrastructure/services";

export const registerUserViaEmailImpl = new RegisterUserViaEmailImpl(
  securityServiceImpl,
  uuidServiceImpl,
  userRepoImpl
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

export const authenticateUserImpl = new AuthenticateUserImpl(
  userRepoImpl,
  securityServiceImpl
);

export const sendVerificationImpl = new SendVerificationImpl(
  persistentTokenRepoImpl,
  securityServiceImpl,
  emailServiceImpl
);
