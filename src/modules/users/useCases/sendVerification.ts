import { EmailService } from "../../shared/infrastructure/services/emailService/emailService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase, { UseCaseConfig } from "../../shared/useCases/useCase";
import constants from "../config/constants";
import PersistentCode from "../entities/persistentCode";
import PersistentToken, { TokenOrCodeType } from "../entities/persistentToken";
import { PersistentCodeRepo } from "../infrastructure/repositories/persistentCodeRepo";
import { PersistentTokenRepo } from "../infrastructure/repositories/persistentTokenRepo";
import { SecurityService } from "../infrastructure/services/securityService";

interface SendVerificationDTO {
  userId: string;
  email: string;
  name: string;
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
    if (config?.mode === constants.verifyMode.CODE) {
      return this.executeViaCode(sendVerificationDTO);
    } else {
      return this.executeViaToken(sendVerificationDTO);
    }
  }

  private async executeViaCode(sendVerificationDTO: SendVerificationDTO) {
    const { userId, email, name } = sendVerificationDTO;

    await this.persistentCodeRepo.deleteByUserIdAndType(
      userId,
      TokenOrCodeType.verification
    );

    const persistentCodeProps = {
      userId,
      type: TokenOrCodeType.verification,
    };
    const verificationCode = await PersistentCode.create(
      persistentCodeProps,
      this.securityService,
      this.uuidService
    );

    await this.persistentCodeRepo.create(verificationCode);

    await this.emailService.sendVerificationCodeMail(
      email,
      verificationCode,
      name
    );
  }

  private async executeViaToken(sendVerificationDTO: SendVerificationDTO) {
    const { userId, email, name } = sendVerificationDTO;

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

    await this.emailService.sendVerificationTokenMail(
      email,
      verificationToken,
      name
    );
  }
}
