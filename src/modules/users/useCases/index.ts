import { OAuth2Client } from "google-auth-library";
import { securityServiceImpl } from "../infrastructure/services";
import {
  persistentCodeRepoImpl,
  persistentTokenRepoImpl,
  userRepoImpl,
} from "../infrastructure/repositories";
import { RegisterUserImpl } from "./registerUser";
import { LoginUserImpl } from "./loginUser";
import { VerifyUserImpl } from "./verifyUser";
import { AuthenticateUserImpl } from "./authenticateUser";
import { SendVerificationImpl } from "./sendVerification";
import {
  emailServiceImpl,
  fileServiceImpl,
  uuidServiceImpl,
} from "../../shared/infrastructure/services";
import { ForgotPasswordImpl } from "./forgotPassword";
import { ResetPasswordImpl } from "./resetPassword";
import { GetUserImpl } from "./getUser";
import { UpdateUserImpl } from "./updateUser";
import { GoogleSignInVerifyImpl } from "./googleSignInVerify";
import { ChangePasswordImpl } from "./changePassword";
import { DeleteAccountImpl } from "./deleteAccount";

const client = new OAuth2Client();

export const registerUserImpl = new RegisterUserImpl(
  securityServiceImpl,
  uuidServiceImpl,
  userRepoImpl
);

export const loginUserImpl = new LoginUserImpl(
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
  persistentCodeRepoImpl,
  userRepoImpl,
  securityServiceImpl,
  emailServiceImpl,
  uuidServiceImpl
);

export const resetPasswordImpl = new ResetPasswordImpl(
  userRepoImpl,
  persistentTokenRepoImpl,
  persistentCodeRepoImpl,
  securityServiceImpl
);

export const getUserImpl = new GetUserImpl(userRepoImpl);

export const updateUserImpl = new UpdateUserImpl(
  userRepoImpl,
  securityServiceImpl
);

export const googleSignInVerifyImpl = new GoogleSignInVerifyImpl(
  securityServiceImpl,
  uuidServiceImpl,
  userRepoImpl,
  client
);

export const changePasswordImpl = new ChangePasswordImpl(
  securityServiceImpl,
  userRepoImpl
);

export const deleteAccountImpl = new DeleteAccountImpl(
  userRepoImpl,
  fileServiceImpl
);
