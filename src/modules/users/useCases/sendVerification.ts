import { EmailService } from "../../shared/infrastructure/services/emailService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import PersistentToken, { TokenType } from "../entities/persistentToken";
import { PersistentTokenRepo } from "../infrastructure/repositories/persistentTokenRepo";
import { SecurityService } from "../infrastructure/services/securityService";

interface SendVerificationDTO {
  userId: string;
  email: string;
}

export interface SendVerification extends UseCase<SendVerificationDTO, void> {
  execute: (sendVerificationDTO: SendVerificationDTO) => void;
}

export class SendVerificationImpl implements SendVerification {
  constructor(
    private persistentTokenRepo: PersistentTokenRepo,
    private securityService: SecurityService,
    private emailService: EmailService,
    private uuidService: UUIDService
  ) {}

  async execute(sendVerificationDTO: SendVerificationDTO) {
    const { userId, email } = sendVerificationDTO;

    await this.persistentTokenRepo.deleteMany({
      userId,
      type: TokenType.verification,
    });

    const persistentTokenProps = {
      userId,
      type: TokenType.verification,
    };
    const verificationToken = PersistentToken.create(
      persistentTokenProps,
      this.securityService,
      this.uuidService
    );
    await this.persistentTokenRepo.create(verificationToken);

    await this.emailService.sendVerificationMail(email, verificationToken);
  }
}
