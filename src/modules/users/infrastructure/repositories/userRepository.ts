import AppError from "../../../shared/core/AppError";
import User, { CreateUserProps } from "../../entities/user";
import { SecurityService } from "../services/securityService";
import { UUIDService } from "../services/uuidService";

interface GetUserConfig {
  includePassword: boolean;
}

export interface UserRepo {
  emailExists: (email: string) => Promise<boolean>;
  usernameExists: (username: string) => Promise<boolean>;
  create: (user: User) => void;
  getUserByEmail: (
    email: string,
    config?: GetUserConfig
  ) => Promise<User | null>;
  getUserById: (id: string, config?: GetUserConfig) => Promise<User | null>;
  update: (userId: string, payload: Partial<CreateUserProps>) => void;
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

  async create(user: User) {
    try {
      const userProps = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        password: user.password,
        role: user.role,
        verified: user.verified,
      };
      await this.UserModel.create(userProps);
    } catch (error) {
      throw AppError.internalServerError("Error creating user", error);
    }
  }

  async update(userId: string, payload: Partial<CreateUserProps>) {
    delete payload.id; // can't update ID

    const user: User | null = await this.getUser({ where: { id: userId } });
    if (!user) throw AppError.notFoundError("User not found");

    const updateUserProps = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      verified: user.verified,
      isPasswordHashed: false,
      isPasswordRequired: false,
      ...payload,
    };
    if (payload.password) {
      updateUserProps.isPasswordRequired = true;
      updateUserProps.isPasswordHashed = false;
    }
    const updatedUser = await User.create(
      updateUserProps,
      this.securityService,
      this.uuidService
    );

    try {
      await this.UserModel.update(
        {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          username: updatedUser.username,
          password: updatedUser.password,
          role: updatedUser.role,
          verified: updatedUser.verified,
        },
        { where: { id: userId } }
      );
    } catch (error) {
      throw AppError.internalServerError("Error updating user", error);
    }
  }

  private async getUser(
    queryOption: any,
    config = { includePassword: false }
  ): Promise<User | null> {
    let userData: any;

    try {
      userData = await this.UserModel.findOne(queryOption);
    } catch (error) {
      throw AppError.internalServerError("Error retrieving user", error);
    }

    if (!userData) return null;

    const createUserProps: CreateUserProps = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      username: userData.username,
      role: userData.role,
      verified: userData.verified,
      isPasswordHashed: true,
      isPasswordRequired: false,
    };
    if (config.includePassword) {
      createUserProps.password = userData.password;
      createUserProps.isPasswordRequired = true;
    }
    return User.create(createUserProps, this.securityService, this.uuidService);
  }

  async getUserByEmail(
    email = "",
    config?: GetUserConfig
  ): Promise<User | null> {
    const queryOption = { where: { email } };

    return this.getUser(queryOption, config);
  }

  async getUserById(id = "", config?: GetUserConfig): Promise<User | null> {
    const queryOption = { where: { id } };

    return this.getUser(queryOption, config);
  }
}
