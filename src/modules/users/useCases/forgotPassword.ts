import AppError from "../../shared/AppError";
import { EmailService } from "../../shared/infrastructure/services/emailService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import PersistentToken, { TokenOrCodeType } from "../entities/persistentToken";
import { PersistentTokenRepo } from "../infrastructure/repositories/persistentTokenRepo";
import { UserRepo } from "../infrastructure/repositories/userRepository";
import { SecurityService } from "../infrastructure/services/securityService";

interface ForgotPasswordDTO {
  email: string;
}

export interface ForgotPassword extends UseCase<ForgotPasswordDTO, void> {
  execute: (forgotPasswordDTO: ForgotPasswordDTO) => void;
}

export class ForgotPasswordImpl implements ForgotPassword {
  constructor(
    private persistentTokenRepo: PersistentTokenRepo,
    private userRepo: UserRepo,
    private securityService: SecurityService,
    private emailService: EmailService,
    private uuidService: UUIDService
  ) {}

  async execute(forgotPasswordDTO: ForgotPasswordDTO) {
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

    await this.emailService.sendPasswordResetMail(email, verificationToken);
  }
}
