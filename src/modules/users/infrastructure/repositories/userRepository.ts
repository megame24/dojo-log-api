import AppError from "../../../shared/core/AppError";
import User, { CreateUserProps, UserProps } from "../../entities/user";
import { SecurityService } from "../services/securityService";
import { UUIDService } from "../services/uuidService";

export interface UserRepo {
  emailExists: (email: string) => Promise<boolean>;
  usernameExists: (username: string) => Promise<boolean>;
  create: (user: UserProps) => void;
  getUserByEmail: (email: string) => Promise<User>;
}

export class UserRepoImpl implements UserRepo {
  constructor(
    private UserModel: any,
    private securityService: SecurityService,
    private uuidService: UUIDService
  ) {}

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

  private async getUser(queryOption: any): Promise<any> {
    try {
      return this.UserModel.findOne(queryOption);
    } catch (error) {
      throw AppError.internalServerError("Error retrieving user", error);
    }
  }

  async getUserByEmail(email = ""): Promise<User> {
    const queryOption = { where: { email } };

    const userData: any = await this.getUser(queryOption);
    if (!userData) throw AppError.notFoundError("User not found");

    const createUserProps: CreateUserProps = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      role: userData.role,
      verified: userData.verified,
      isPasswordHashed: true,
      isPasswordRequired: true,
    };
    return User.create(createUserProps, this.securityService, this.uuidService);
  }
}
