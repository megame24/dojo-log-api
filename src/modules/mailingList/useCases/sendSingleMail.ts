import AppError from "../../shared/AppError";
import { EmailService } from "../../shared/infrastructure/services/emailService/emailService";
import { ImplicitEmailTemplateIds } from "../../shared/infrastructure/services/emailService/emailTemplates";
import UseCase from "../../shared/useCases/useCase";
import { MailingListRepo } from "../infrastructure/repositories/mailingListRepo";

interface SendSingleMailDTO {
  email: string;
  emailTemplateId: ImplicitEmailTemplateIds;
}

export interface SendSingleMail extends UseCase<SendSingleMailDTO, void> {
  execute: (sendSingleMailDTO: SendSingleMailDTO) => void;
}

export class SendSingleMailImpl implements SendSingleMail {
  constructor(
    private mailingListRepo: MailingListRepo,
    private emailService: EmailService
  ) {}

  async execute(sendSingleMailDTO: SendSingleMailDTO) {
    const { email, emailTemplateId } = sendSingleMailDTO;

    const mail = await this.mailingListRepo.getByEmail(email, {
      subscribed: true,
    });
    if (!mail) throw AppError.notFoundError("Email not found");

    await this.emailService.sendMailToMailingList(
      [mail.email],
      emailTemplateId
    );
  }
}
