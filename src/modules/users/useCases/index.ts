import { securityServiceImpl } from "../infrastructure/services";
import {
  persistentCodeRepoImpl,
  persistentTokenRepoImpl,
  userRepoImpl,
} from "../infrastructure/repositories";
import { RegisterUserViaEmailImpl } from "./registerUserViaEmail";
import { LoginUserViaEmailImpl } from "./loginUserViaEmail";
import { VerifyUserImpl } from "./verifyUser";
import { AuthenticateUserImpl } from "./authenticateUser";
import { SendVerificationImpl } from "./sendVerification";
import {
  emailServiceImpl,
  uuidServiceImpl,
} from "../../shared/infrastructure/services";
import { ForgotPasswordImpl } from "./forgotPassword";
import { ResetPasswordImpl } from "./resetPassword";

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
  persistentCodeRepoImpl,
  securityServiceImpl
);

export const authenticateUserImpl = new AuthenticateUserImpl(
  userRepoImpl,
  securityServiceImpl,
  uuidServiceImpl
);

export const sendVerificationImpl = new SendVerificationImpl(
  persistentTokenRepoImpl,
  persistentCodeRepoImpl,
  securityServiceImpl,
  emailServiceImpl,
  uuidServiceImpl
);

export const forgotPasswordImpl = new ForgotPasswordImpl(
  persistentTokenRepoImpl,
  userRepoImpl,
  securityServiceImpl,
  emailServiceImpl,
  uuidServiceImpl
);

export const resetPasswordImpl = new ResetPasswordImpl(
  userRepoImpl,
  persistentTokenRepoImpl,
  securityServiceImpl
);
