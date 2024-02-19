import AppError from "../../../shared/AppError";
import Entity from "../../../shared/entities/entity";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import Mail, { MailProps } from "../../entities/mail";

export interface MailingListRepo {
  add: (mail: Mail) => void;
  getByEmail: (email: string) => Promise<Mail | null>;
  unsubscribeFromMailingList: (mail: Mail) => void;
}

export class MailingListRepoImpl implements MailingListRepo {
  constructor(
    private MailingListModel: any,
    private uuidService: UUIDService
  ) {}

  async add(mail: Mail) {
    try {
      const mailProps = {
        id: mail.id,
        email: mail.email,
        subscribed: mail.subscribed,
      };
      await this.MailingListModel.create(mailProps);
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error adding mail to mailing list",
        error
      );
    }
  }

  async getByEmail(email = ""): Promise<Mail | null> {
    try {
      const formattedEmail = Entity.formatEmail(email);

      const mailData = await this.MailingListModel.findOne({
        where: { email: formattedEmail },
      });

      if (!mailData) return null;

      const mailProps: MailProps = {
        id: mailData.id,
        email: mailData.email,
        subscribed: mailData.subscribed,
      };

      return Mail.create(mailProps, this.uuidService);
    } catch (error: any) {
      throw AppError.internalServerError("Error getting mail", error);
    }
  }

  async unsubscribeFromMailingList(mail: Mail) {
    try {
      await this.MailingListModel.update(
        { subscribed: mail.subscribed },
        { where: { id: mail.id } }
      );
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error unsubscribing mail from mailing list",
        error
      );
    }
  }
}
