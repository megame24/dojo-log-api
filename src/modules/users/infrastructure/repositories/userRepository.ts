import AppError from "../../../shared/AppError";
import Entity from "../../../shared/entities/entity";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import User, { CreateUserProps } from "../../entities/user";
import { SecurityService } from "../services/securityService";

interface GetUserConfig {
  includePassword: boolean;
}

export interface UserRepo {
  create: (user: User) => void;
  getUserByEmail: (
    email: string,
    config?: GetUserConfig
  ) => Promise<User | null>;
  getUserByUsername: (
    username: string,
    config?: GetUserConfig
  ) => Promise<User | null>;
  getUserById: (id: string, config?: GetUserConfig) => Promise<User | null>;
  update: (user: User, payload: Partial<CreateUserProps>) => Promise<User>;
  delete: (user: User) => void;
}

export class UserRepoImpl implements UserRepo {
  constructor(
    private UserModel: any,
    private ExpoNotificationTokenModel: any,
    private securityService: SecurityService,
    private uuidService: UUIDService
  ) {}

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
    } catch (error: any) {
      throw AppError.internalServerError("Error creating user", error);
    }
  }

  async update(user: User, payload: Partial<CreateUserProps>): Promise<User> {
    delete payload.id; // can't update ID

    const updateUserProps = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      verified: user.verified,
      expoNotificationTokens: user.expoNotificationTokens,
      isPasswordHashed: false,
      isPasswordRequired: false,
      ...payload,
    };
    if ("password" in payload) {
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
        { where: { id: updatedUser.id } }
      );
      return updatedUser;
    } catch (error: any) {
      throw AppError.internalServerError("Error updating user", error);
    }
  }

  private async getUser(
    queryOption: any,
    config = { includePassword: false }
  ): Promise<User | null> {
    let userData: any;

    try {
      userData = await this.UserModel.findOne({
        ...queryOption,
        include: [
          { model: this.ExpoNotificationTokenModel, required: false },
          ...(queryOption?.include ? queryOption.include : []),
        ],
      });
    } catch (error: any) {
      throw AppError.internalServerError("Error retrieving user", error);
    }

    if (!userData) return null;

    const expoNotificationTokens = userData.ExpoNotificationTokens?.map(
      (token: any) => {
        return token.token;
      }
    );

    const createUserProps: CreateUserProps = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      username: userData.username,
      role: userData.role,
      verified: userData.verified,
      isPasswordHashed: true,
      isPasswordRequired: false,
      expoNotificationTokens,
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
    const formattedEmail = Entity.formatEmail(email);

    const queryOption = { where: { email: formattedEmail } };

    return this.getUser(queryOption, config);
  }

  async getUserByUsername(
    username = "",
    config?: GetUserConfig
  ): Promise<User | null> {
    const queryOption = { where: { username } };

    return this.getUser(queryOption, config);
  }

  async getUserById(id: string, config?: GetUserConfig): Promise<User | null> {
    if (!id) throw AppError.badRequestError("userId is required");

    const queryOption = { where: { id } };

    return this.getUser(queryOption, config);
  }

  async delete(user: User) {
    await this.UserModel.destroy({ where: { id: user.id } });
  }
}
