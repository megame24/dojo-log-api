import { EmailService } from "../../shared/infrastructure/services/emailService/emailService";
import { ImplicitEmailTemplateIds } from "../../shared/infrastructure/services/emailService/emailTemplates";
import UseCase from "../../shared/useCases/useCase";
import { MailingListRepo } from "../infrastructure/repositories/mailingListRepo";

interface SendMailToAllSubscribersDTO {
  emailTemplateId: ImplicitEmailTemplateIds;
}

export interface SendMailToAllSubscribers
  extends UseCase<SendMailToAllSubscribersDTO, void> {
  execute: (sendMailToAllSubscribersDTO: SendMailToAllSubscribersDTO) => void;
}

export class SendMailToAllSubscribersImpl implements SendMailToAllSubscribers {
  constructor(
    private mailingListRepo: MailingListRepo,
    private emailService: EmailService
  ) {}

  async execute(sendMailToAllSubscribersDTO: SendMailToAllSubscribersDTO) {
    const { emailTemplateId } = sendMailToAllSubscribersDTO;

    const emails = await this.mailingListRepo.getRawEmailsOfSubscribers();

    await this.emailService.sendMailToMailingList(emails, emailTemplateId);
  }
}
