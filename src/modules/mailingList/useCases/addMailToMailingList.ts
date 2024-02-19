import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Mail from "../entities/mail";
import { MailingListRepo } from "../infrastructure/repositories/mailingListRepo";

interface AddMailToMailingListDTO {
  email: string;
}

export interface AddMailToMailingList
  extends UseCase<AddMailToMailingListDTO, void> {
  execute: (addMailToMailingListDTO: AddMailToMailingListDTO) => void;
}

export class AddMailToMailingListImpl implements AddMailToMailingList {
  constructor(
    private uuidService: UUIDService,
    private mailingListRepo: MailingListRepo
  ) {}

  async execute(addMailToMailingListDTO: AddMailToMailingListDTO) {
    const { email } = addMailToMailingListDTO;

    const existingMail = await this.mailingListRepo.getByEmail(email);
    if (existingMail) return;

    const mailProps = {
      email,
      subscribed: true,
    };

    const mail = Mail.create(mailProps, this.uuidService);
    await this.mailingListRepo.add(mail);
  }
}
