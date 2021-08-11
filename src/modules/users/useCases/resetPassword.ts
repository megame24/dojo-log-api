import AppError from "../../shared/core/AppError";
import { UseCase } from "../../shared/core/types";
import { PersistentTokenRepo } from "../infrastructure/repositories/persistentTokenRepo";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface ResetPasswordDTO {
  userId: string;
  token: string;
  password: string;
}

export interface ResetPassword extends UseCase<ResetPasswordDTO, void> {
  execute: (resetPasswordDTO: ResetPasswordDTO) => void;
}

export class ResetPasswordImpl implements ResetPassword {
  constructor(
    private userRepo: UserRepo,
    private persistentTokenRepo: PersistentTokenRepo,
    private securityService: SecurityService
  ) {}

  async execute(resetPasswordDTO: ResetPasswordDTO) {
    const { token, userId, password } = resetPasswordDTO;

    const validToken = this.securityService.verifyToken(token);
    if (!validToken) throw AppError.badRequestError("Invalid token");

    const verificationToken =
      await this.persistentTokenRepo.getByUserIdAndToken(userId, token);
    if (!verificationToken) throw AppError.unauthorizedError();

    await this.userRepo.update(userId, { password });
    await this.persistentTokenRepo.deleteOne(verificationToken);
  }
}
