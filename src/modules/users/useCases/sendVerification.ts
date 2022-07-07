import { EmailService } from "../../shared/infrastructure/services/emailService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase, { UseCaseConfig } from "../../shared/useCases/useCase";
import PersistentCode from "../entities/persistentCode";
import PersistentToken, { TokenOrCodeType } from "../entities/persistentToken";
import { PersistentCodeRepo } from "../infrastructure/repositories/persistentCodeRepo";
import { PersistentTokenRepo } from "../infrastructure/repositories/persistentTokenRepo";
import { SecurityService } from "../infrastructure/services/securityService";

interface SendVerificationDTO {
  userId: string;
  email: string;
}

export interface SendVerification extends UseCase<SendVerificationDTO, void> {
  execute: (
    sendVerificationDTO: SendVerificationDTO,
    config?: UseCaseConfig
  ) => void;
}

export class SendVerificationImpl implements SendVerification {
  constructor(
    private persistentTokenRepo: PersistentTokenRepo,
    private persistentCodeRepo: PersistentCodeRepo,
    private securityService: SecurityService,
    private emailService: EmailService,
    private uuidService: UUIDService
  ) {}

  async execute(
    sendVerificationDTO: SendVerificationDTO,
    config?: UseCaseConfig
  ) {
    if (config?.mode === "code") {
      await this.executeViaCode(sendVerificationDTO);
    } else {
      this.executeViaToken(sendVerificationDTO);
    }
  }

  private async executeViaToken(sendVerificationDTO: SendVerificationDTO) {
    const { userId, email } = sendVerificationDTO;

    await this.persistentTokenRepo.deleteMany({
      userId,
      type: TokenOrCodeType.verification,
    });

    const persistentTokenProps = {
      userId,
      type: TokenOrCodeType.verification,
    };
    const verificationToken = PersistentToken.create(
      persistentTokenProps,
      this.securityService,
      this.uuidService
    );
    await this.persistentTokenRepo.create(verificationToken);

    await this.emailService.sendVerificationMail(email, verificationToken);
  }

  private async executeViaCode(sendVerificationDTO: SendVerificationDTO) {
    const { userId, email } = sendVerificationDTO;

    await this.persistentCodeRepo.deleteMany({
      userId,
      type: TokenOrCodeType.verification,
    });

    const persistentTokenProps = {
      userId,
      type: TokenOrCodeType.verification,
    };
    const verificationCode = await PersistentCode.create(
      persistentTokenProps,
      this.securityService,
      this.uuidService
    );

    await this.persistentCodeRepo.create(verificationCode);

    await this.emailService.sendVerificationMail(email, verificationCode);
  }
}
