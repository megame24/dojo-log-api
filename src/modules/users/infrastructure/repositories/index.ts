import { UserRepoImpl } from "./userRepository";
import { securityServiceImpl } from "../services";
import { PersistentTokenRepoImpl } from "./persistentTokenRepo";
import models from "../../../shared/infrastructure/database/models";
import { uuidServiceImpl } from "../../../shared/infrastructure/services";

const { User, PersistentToken } = <any>models;

export const userRepoImpl = new UserRepoImpl(
  User,
  securityServiceImpl,
  uuidServiceImpl
);

export const persistentTokenRepoImpl = new PersistentTokenRepoImpl(
  PersistentToken,
  securityServiceImpl,
  uuidServiceImpl
);
