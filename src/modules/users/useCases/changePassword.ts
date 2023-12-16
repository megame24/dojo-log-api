import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import User from "../entities/user";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
  user: User;
}

export interface ChangePassword extends UseCase<ChangePasswordDTO, void> {
  execute: (changePasswordDTO: ChangePasswordDTO) => void;
}

export class ChangePasswordImpl implements ChangePassword {
  constructor(
    private securityService: SecurityService,
    private userRepo: UserRepo
  ) {}

  async execute(changePasswordDTO: ChangePasswordDTO) {
    const { oldPassword, newPassword, user } = changePasswordDTO;

    const userWithPassword = await this.userRepo.getUserById(<string>user.id, {
      includePassword: true,
    });
    if (!userWithPassword) throw AppError.notFoundError("User not found");

    const passwordMatch = await this.securityService.compareHash(
      oldPassword,
      <string>userWithPassword.password
    );
    if (!passwordMatch) throw AppError.badRequestError("Incorrect password");

    await this.userRepo.update(user, { password: newPassword });
  }
}
