import AppError from "../../shared/AppError";
import UseCase, { UseCaseConfig } from "../../shared/useCases/useCase";
import constants from "../config/constants";
import { TokenOrCodeType } from "../entities/persistentToken";
import { PersistentCodeRepo } from "../infrastructure/repositories/persistentCodeRepo";
import { PersistentTokenRepo } from "../infrastructure/repositories/persistentTokenRepo";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface VerifyUserViaCodeDTO {
  userId: string;
  code: string;
}

interface VerifyUserViaTokenDTO {
  userId: string;
  token: string;
}

export interface VerifyUser
  extends UseCase<VerifyUserViaCodeDTO | VerifyUserViaTokenDTO, void> {
  execute: (
    verifyUserDTO: VerifyUserViaCodeDTO | VerifyUserViaTokenDTO,
    config?: UseCaseConfig
  ) => Promise<string | void>;
}

export class VerifyUserImpl implements VerifyUser {
  constructor(
    private userRepo: UserRepo,
    private persistentTokenRepo: PersistentTokenRepo,
    private persistentCodeRepo: PersistentCodeRepo,
    private securityService: SecurityService
  ) {}

  async execute(
    verifyUserDTO: VerifyUserViaCodeDTO | VerifyUserViaTokenDTO,
    config?: UseCaseConfig
  ): Promise<string | void> {
    if (config?.mode === constants.verifyMode.CODE) {
      return this.executeViaCode(<VerifyUserViaCodeDTO>verifyUserDTO);
    } else {
      return this.executeViaToken(<VerifyUserViaTokenDTO>verifyUserDTO);
    }
  }

  async executeViaCode(verifyUserDTO: VerifyUserViaCodeDTO): Promise<string> {
    const { code, userId } = verifyUserDTO;
    const now = new Date();
    const invalidCodeErrorMessage = "Invalid code";

    const verificationCode = await this.persistentCodeRepo.getByUserIdAndType(
      userId,
      TokenOrCodeType.verification
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

    await this.userRepo.update(user, { verified: true });
    await this.persistentCodeRepo.deleteByUserIdAndType(
      userId,
      TokenOrCodeType.verification
    );

    const authToken = await this.securityService.generateToken({
      id: user.id,
      username: user.username,
      verified: user.verified,
      role: user.role,
      name: user.name,
      email: user.email,
    });
    return authToken;
  }

  async executeViaToken(verifyUserDTO: VerifyUserViaTokenDTO) {
    const { token, userId } = verifyUserDTO;

    const validToken = this.securityService.verifyToken(token);
    if (!validToken) throw AppError.badRequestError("Invalid token");

    const verificationToken =
      await this.persistentTokenRepo.getByUserIdAndToken(userId, token);
    if (!verificationToken) throw AppError.unauthorizedError();

    const user = await this.userRepo.getUserById(userId);
    if (!user) throw AppError.notFoundError("User not found");

    await this.userRepo.update(user, { verified: true });
    await this.persistentTokenRepo.deleteOne(verificationToken);
  }
}
