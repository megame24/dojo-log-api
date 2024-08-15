import {
  emailServiceImpl,
  uuidServiceImpl,
} from "../../shared/infrastructure/services";
import { mailingListRepoImpl } from "../infrastructure/repositories";
import { AddMailToMailingListImpl } from "./addMailToMailingList";
import { GetAllSubscribersEmailsImpl } from "./getAllSubscribersEmails";
import { SendMailToAllSubscribersImpl } from "./sendMailToAllSubscribers";
import { SendSingleMailImpl } from "./sendSingleMail";
import { UnsubscribeFromMailingListImpl } from "./unsubscribeFromMailingList";

export const addMailToMailingListImpl = new AddMailToMailingListImpl(
  uuidServiceImpl,
  mailingListRepoImpl
);

export const unsubscribeFromMailingListImpl =
  new UnsubscribeFromMailingListImpl(uuidServiceImpl, mailingListRepoImpl);

export const sendSingleMailImpl = new SendSingleMailImpl(
  mailingListRepoImpl,
  emailServiceImpl
);

export const sendMailToAllSubscribersImpl = new SendMailToAllSubscribersImpl(
  mailingListRepoImpl,
  emailServiceImpl
);

export const getAllSubscribersEmailsImpl = new GetAllSubscribersEmailsImpl(
  mailingListRepoImpl
);
