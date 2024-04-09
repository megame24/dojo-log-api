import { UserRepo } from "../infrastructure/repositories/userRepository";
import UseCase from "../../shared/useCases/useCase";
import User from "../entities/user";
import AppError from "../../shared/AppError";
import { SecurityService } from "../infrastructure/services/securityService";

interface UpdateUserDTO {
  user: User;
  name?: string;
  username?: string;
  email?: string;
}

export interface UpdateUser extends UseCase<UpdateUserDTO, Promise<string>> {
  execute: (updateUserDTO: UpdateUserDTO) => Promise<string>;
}

export class UpdateUserImpl implements UpdateUser {
  constructor(
    private userRepo: UserRepo,
    private securityService: SecurityService
  ) {}

  async execute(updateUserDTO: UpdateUserDTO): Promise<string> {
    const { user: outdatedUser, name, username, email } = updateUserDTO;

    if (email && email.toLowerCase() !== outdatedUser.email) {
      const userWithSameEmail = await this.userRepo.getUserByEmail(email);
      if (userWithSameEmail) {
        throw AppError.badRequestError("User with that email already exists");
      }
    }

    if (username && username !== outdatedUser.username) {
      const userWithSameUsername = await this.userRepo.getUserByUsername(
        username
      );
      if (userWithSameUsername) {
        throw AppError.badRequestError(
          "User with that username already exists"
        );
      }
    }

    const updateUserPayload = {
      ...(name && { name }),
      ...(username && { username }),
      ...(email && { email }),
    };
    const updatedUser = await this.userRepo.update(
      outdatedUser,
      updateUserPayload
    );

    const authToken = await this.securityService.generateToken({
      id: updatedUser.id,
      username: updatedUser.username,
      verified: updatedUser.verified,
      role: updatedUser.role,
      name: updatedUser.name,
      email: updatedUser.email,
      expoNotificationTokens: updatedUser.expoNotificationTokens,
    });
    return authToken;
  }
}
