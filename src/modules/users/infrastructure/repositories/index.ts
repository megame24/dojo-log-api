import { UserRepoImpl } from "./userRepository";
import { securityServiceImpl } from "../services";
import { PersistentTokenRepoImpl } from "./persistentTokenRepo";
import models from "../../../shared/infrastructure/database/models";
import { uuidServiceImpl } from "../../../shared/infrastructure/services";
import { PersistentCodeRepoImpl } from "./persistentCodeRepo";
import { ExpoNotificationTokenRepoImpl } from "./expoNotificationTokenRepo";

const { User, PersistentToken, PersistentCode, ExpoNotificationToken } = <any>(
  models
);

export const userRepoImpl = new UserRepoImpl(
  User,
  ExpoNotificationToken,
  securityServiceImpl,
  uuidServiceImpl
);

export const persistentTokenRepoImpl = new PersistentTokenRepoImpl(
  PersistentToken,
  securityServiceImpl,
  uuidServiceImpl
);

export const persistentCodeRepoImpl = new PersistentCodeRepoImpl(
  PersistentCode,
  securityServiceImpl,
  uuidServiceImpl
);

export const expoNotificationTokenRepoImpl = new ExpoNotificationTokenRepoImpl(
  ExpoNotificationToken,
  uuidServiceImpl
);
