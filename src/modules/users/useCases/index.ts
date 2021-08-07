import {
  securityServiceImpl,
  uuidServiceImpl,
} from "../infrastructure/services";
import { userRepoImpl } from "../infrastructure/repositories";
import { RegisterUserViaEmailImpl } from "./registerUserViaEmail";
import { emailServiceImpl } from "../../shared/infrastructure/services";

export const registerUserViaEmailImpl = new RegisterUserViaEmailImpl(
  securityServiceImpl,
  uuidServiceImpl,
  userRepoImpl,
  emailServiceImpl
);
