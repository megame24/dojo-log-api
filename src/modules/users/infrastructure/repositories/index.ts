import models from "../../../shared/infrastructure/database/models";
import { UserRepoImpl } from "./userRepository";

const { User } = <any>models;

export const userRepoImpl = new UserRepoImpl(User);
