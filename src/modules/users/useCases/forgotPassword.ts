import AppError from "../../shared/AppError";
import { EmailService } from "../../shared/infrastructure/services/emailService/emailService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase, { UseCaseConfig } from "../../shared/useCases/useCase";
import constants from "../config/constants";
import PersistentCode from "../entities/persistentCode";
import PersistentToken, { TokenOrCodeType } from "../entities/persistentToken";
import { PersistentCodeRepo } from "../infrastructure/repositories/persistentCodeRepo";
import { PersistentTokenRepo } from "../infrastructure/repositories/persistentTokenRepo";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface ForgotPasswordDTO {
  email: string;
}

export interface ForgotPassword extends UseCase<ForgotPasswordDTO, void> {
  execute: (
    forgotPasswordDTO: ForgotPasswordDTO,
    config?: UseCaseConfig
  ) => Promise<string | void>;
}

export class ForgotPasswordImpl implements ForgotPassword {
  constructor(
    private persistentTokenRepo: PersistentTokenRepo,
    private persistentCodeRepo: PersistentCodeRepo,
    private userRepo: UserRepo,
    private securityService: SecurityService,
    private emailService: EmailService,
    private uuidService: UUIDService
  ) {}

  async execute(
    forgotPasswordDTO: ForgotPasswordDTO,
    config?: UseCaseConfig
  ): Promise<string | void> {
    if (config?.mode === constants.verifyMode.CODE) {
      return this.executeViaCode(forgotPasswordDTO);
    } else {
      return this.executeViaToken(forgotPasswordDTO);
    }
  }

  async executeViaCode(forgotPasswordDTO: ForgotPasswordDTO): Promise<string> {
    const { email } = forgotPasswordDTO;

    const user = await this.userRepo.getUserByEmail(email);
    if (!user) throw AppError.notFoundError("User not found");

    const userId = <string>user.id;
    await this.persistentCodeRepo.deleteByUserIdAndType(
      userId,
      TokenOrCodeType.resetPassword
    );

    const persistentCodeProps = {
      userId,
      type: TokenOrCodeType.resetPassword,
    };
    const verificationCode = await PersistentCode.create(
      persistentCodeProps,
      this.securityService,
      this.uuidService
    );
    await this.persistentCodeRepo.create(verificationCode);
    await this.emailService.sendPasswordResetCodeMail(
      email,
      verificationCode,
      user.name
    );

    return <string>user.id;
  }

  async executeViaToken(forgotPasswordDTO: ForgotPasswordDTO) {
    const { email } = forgotPasswordDTO;

    const user = await this.userRepo.getUserByEmail(email);
    if (!user) throw AppError.notFoundError("User not found");

    const userId = <string>user.id;
    await this.persistentTokenRepo.deleteMany({
      userId,
      type: TokenOrCodeType.resetPassword,
    });

    const persistentTokenProps = {
      userId,
      type: TokenOrCodeType.resetPassword,
    };
    const verificationToken = PersistentToken.create(
      persistentTokenProps,
      this.securityService,
      this.uuidService
    );
    await this.persistentTokenRepo.create(verificationToken);

    await this.emailService.sendPasswordResetTokenMail(
      email,
      verificationToken,
      user.name
    );
  }
}
