import AppError from "../../shared/AppError";
import UseCase, { UseCaseConfig } from "../../shared/useCases/useCase";
import constants from "../config/constants";
import { TokenOrCodeType } from "../entities/persistentToken";
import { PersistentCodeRepo } from "../infrastructure/repositories/persistentCodeRepo";
import { PersistentTokenRepo } from "../infrastructure/repositories/persistentTokenRepo";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface ResetPasswordViaTokenDTO {
  userId: string;
  token: string;
  password: string;
}

interface ResetPasswordViaCodeDTO {
  userId: string;
  code: string;
  password: string;
}

// TODO: consider a better way for validating the right DTO to be passed in, currently flaky!!!
export interface ResetPassword
  extends UseCase<ResetPasswordViaTokenDTO | ResetPasswordViaCodeDTO, void> {
  execute: (
    resetPasswordDTO: ResetPasswordViaTokenDTO | ResetPasswordViaCodeDTO,
    config?: UseCaseConfig
  ) => void;
}

export class ResetPasswordImpl implements ResetPassword {
  constructor(
    private userRepo: UserRepo,
    private persistentTokenRepo: PersistentTokenRepo,
    private persistentCodeRepo: PersistentCodeRepo,
    private securityService: SecurityService
  ) {}

  // TODO: consider refactoring this, very similar to verifyUser!!!
  async execute(
    resetPasswordDTO: ResetPasswordViaTokenDTO | ResetPasswordViaCodeDTO,
    config?: UseCaseConfig
  ) {
    if (config?.mode === constants.verifyMode.CODE) {
      return this.executeViaCode(<ResetPasswordViaCodeDTO>resetPasswordDTO);
    } else {
      return this.executeViaToken(<ResetPasswordViaTokenDTO>resetPasswordDTO);
    }
  }

  async executeViaCode(resetPasswordDTO: ResetPasswordViaCodeDTO) {
    const { code, userId, password } = resetPasswordDTO;
    const now = new Date();
    const invalidCodeErrorMessage = "Invalid code";

    const verificationCode = await this.persistentCodeRepo.getByUserIdAndType(
      userId,
      TokenOrCodeType.resetPassword
    );
    if (!verificationCode)
      throw AppError.badRequestError(invalidCodeErrorMessage);
    if (now > new Date(<Date>verificationCode.expiresIn))
      throw AppError.badRequestError("Code has expired");

    const codeMatch = await this.securityService.compareHash(
      code,
      <string>verificationCode.encryptedCode
    );
    if (!codeMatch) throw AppError.badRequestError(invalidCodeErrorMessage);

    const user = await this.userRepo.getUserById(userId);
    if (!user) throw AppError.notFoundError("User not found");

    await this.userRepo.update(user, { password });
    await this.persistentCodeRepo.deleteByUserIdAndType(
      userId,
      TokenOrCodeType.resetPassword
    );
  }

  async executeViaToken(resetPasswordDTO: ResetPasswordViaTokenDTO) {
    const { token, userId, password } = resetPasswordDTO;

    const validToken = this.securityService.verifyToken(token);
    if (!validToken) throw AppError.badRequestError("Invalid token");

    const verificationToken =
      await this.persistentTokenRepo.getByUserIdAndToken(userId, token);
    if (!verificationToken) throw AppError.unauthorizedError();

    const user = await this.userRepo.getUserById(userId);
    if (!user) throw AppError.notFoundError("User not found");

    await this.userRepo.update(user, { password });
    await this.persistentTokenRepo.deleteOne(verificationToken);
  }
}
