import { UseCase } from "../../shared/core/types";
import { EmailService } from "../../shared/infrastructure/services/emailService";
import PersistentToken, { TokenType } from "../entities/persistentToken";
import { PersistentTokenRepo } from "../infrastructure/repositories/persistentTokenRepo";
import { SecurityService } from "../infrastructure/services/securityService";

interface SendVerificationDTO {
  id: string;
  email: string;
}

export interface SendVerification
  extends UseCase<SendVerificationDTO, Promise<void>> {
  execute: (sendVerificationDTO: SendVerificationDTO) => Promise<void>;
}

export class SendVerificationImpl implements SendVerification {
  constructor(
    private persistentTokenRepo: PersistentTokenRepo,
    private securityService: SecurityService,
    private emailService: EmailService
  ) {}

  async execute(sendVerificationDTO: SendVerificationDTO) {
    const { id, email } = sendVerificationDTO;

    await this.persistentTokenRepo.deleteMany({
      userId: id,
      type: TokenType.verification,
    });

    const persistentTokenProps = {
      userId: id,
      type: TokenType.verification,
    };
    const verificationToken = PersistentToken.create(
      persistentTokenProps,
      this.securityService
    );
    await this.persistentTokenRepo.create(verificationToken);

    await this.emailService.sendVerificationMail(email, verificationToken);
  }
}
