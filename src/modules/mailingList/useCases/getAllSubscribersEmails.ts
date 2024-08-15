import UseCase from "../../shared/useCases/useCase";
import { MailingListRepo } from "../infrastructure/repositories/mailingListRepo";

export interface GetAllSubscribersEmails
  extends UseCase<void, Promise<string[]>> {
  execute: () => Promise<string[]>;
}

export class GetAllSubscribersEmailsImpl implements GetAllSubscribersEmails {
  constructor(private mailingListRepo: MailingListRepo) {}

  async execute(): Promise<string[]> {
    const subscribersEmails =
      await this.mailingListRepo.getRawEmailsOfSubscribers();

    return subscribersEmails;
  }
}
