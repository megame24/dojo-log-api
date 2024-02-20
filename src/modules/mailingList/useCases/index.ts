import {
  emailServiceImpl,
  uuidServiceImpl,
} from "../../shared/infrastructure/services";
import { mailingListRepoImpl } from "../infrastructure/repositories";
import { AddMailToMailingListImpl } from "./addMailToMailingList";
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
