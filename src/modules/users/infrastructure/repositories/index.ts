import models from "../../../shared/infrastructure/database/models";
import { UserRepoImpl } from "./userRepository";
import { securityServiceImpl, uuidServiceImpl } from "../services";

const { User } = <any>models;

export const userRepoImpl = new UserRepoImpl(
  User,
  securityServiceImpl,
  uuidServiceImpl
);
