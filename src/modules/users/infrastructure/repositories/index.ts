import models from "../../../shared/infrastructure/database/models";
import { UserRepoImpl } from "./userRepository";
import { securityServiceImpl, uuidServiceImpl } from "../services";
import { PersistentTokenRepoImpl } from "./persistentTokenRepo";

const { User, PersistentToken } = <any>models;

export const userRepoImpl = new UserRepoImpl(
  User,
  securityServiceImpl,
  uuidServiceImpl
);

export const persistentTokenRepoImpl = new PersistentTokenRepoImpl(
  PersistentToken,
  securityServiceImpl
);
