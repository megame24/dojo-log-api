import AppError from "../../../shared/core/AppError";
import { UserProps } from "../../entities/user";

export interface UserRepo {
  emailExists: (email: string) => Promise<boolean>;
  usernameExists: (username: string) => Promise<boolean>;
  create: (user: UserProps) => void;
}

export class UserRepoImpl implements UserRepo {
  constructor(private UserModel: any) {}

  async emailExists(email = ""): Promise<boolean> {
    try {
      const user = await this.UserModel.findOne({
        where: { email },
      });
      if (!user) return false;
      return true;
    } catch (error) {
      throw AppError.internalServerError("Error retrieving email", error);
    }
  }

  async usernameExists(username = ""): Promise<boolean> {
    try {
      const user = await this.UserModel.findOne({
        where: { username },
      });
      if (!user) return false;
      return true;
    } catch (error) {
      throw AppError.internalServerError("Error retrieving username", error);
    }
  }

  async create(user: UserProps) {
    try {
      await this.UserModel.create(user);
    } catch (error) {
      throw AppError.internalServerError("Error creating user", error);
    }
  }
}
