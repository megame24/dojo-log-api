import AppError from "../../shared/AppError";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Mail from "../entities/mail";
import { MailingListRepo } from "../infrastructure/repositories/mailingListRepo";

interface UnsubscribeFromMailingListDTO {
  email: string;
}

export interface UnsubscribeFromMailingList
  extends UseCase<UnsubscribeFromMailingListDTO, void> {
  execute: (
    unsubscribeFromMailingListDTO: UnsubscribeFromMailingListDTO
  ) => void;
}

export class UnsubscribeFromMailingListImpl
  implements UnsubscribeFromMailingList
{
  constructor(
    private uuidService: UUIDService,
    private mailingListRepo: MailingListRepo
  ) {}

  async execute(unsubscribeFromMailingListDTO: UnsubscribeFromMailingListDTO) {
    const { email } = unsubscribeFromMailingListDTO;

    const existingMail = await this.mailingListRepo.getByEmail(email);
    if (!existingMail) throw AppError.notFoundError("Email not found");

    const mailProps = {
      id: existingMail.id,
      email,
      subscribed: false,
    };

    const mail = Mail.create(mailProps, this.uuidService);
    await this.mailingListRepo.unsubscribeFromMailingList(mail);
  }
}
