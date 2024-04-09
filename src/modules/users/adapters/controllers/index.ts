import {
  changePasswordImpl,
  createExpoNotificationTokenImpl,
  deleteAccountImpl,
  forgotPasswordImpl,
  googleSignInVerifyImpl,
  loginUserImpl,
  registerUserImpl,
  resetPasswordImpl,
  sendVerificationImpl,
  updateUserImpl,
  verifyUserImpl,
} from "../../useCases";
import RegisterUserController from "./registerUserController";
import LoginUserController from "./loginUserController";
import VerifyUserController from "./verifyUserController";
import SendVerificationController from "./sendVerificationController";
import ForgotPasswordController from "./forgotPasswordController";
import ResetPasswordController from "./resetPasswordController";
import GetUserProfileController from "./getUserProfileController";
import UpdateUserProfileController from "./updateUserProfileController";
import GoogleSignInVerifyController from "./googleSignInVerifyController";
import ChangePasswordController from "./changePasswordController";
import DeleteAccountController from "./deleteAccountController";
import CreateExpoNotificationTokenController from "./createExpoNotificationTokenController";

export const registerUserController = new RegisterUserController(
  registerUserImpl
);

export const loginUserController = new LoginUserController(loginUserImpl);

export const verifyUserController = new VerifyUserController(verifyUserImpl);

export const sendVerificationController = new SendVerificationController(
  sendVerificationImpl
);

export const forgotPasswordController = new ForgotPasswordController(
  forgotPasswordImpl
);

export const resetPasswordController = new ResetPasswordController(
  resetPasswordImpl
);

export const getUserProfileController = new GetUserProfileController();

export const updateUserProfileController = new UpdateUserProfileController(
  updateUserImpl
);

export const googleSignInVerifyController = new GoogleSignInVerifyController(
  googleSignInVerifyImpl
);

export const changePasswordController = new ChangePasswordController(
  changePasswordImpl
);

export const deleteAccountController = new DeleteAccountController(
  deleteAccountImpl
);

export const createExpoNotificationTokenController =
  new CreateExpoNotificationTokenController(createExpoNotificationTokenImpl);
