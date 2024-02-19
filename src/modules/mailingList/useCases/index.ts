import { uuidServiceImpl } from "../../shared/infrastructure/services";
import { mailingListRepoImpl } from "../infrastructure/repositories";
import { AddMailToMailingListImpl } from "./addMailToMailingList";
import { UnsubscribeFromMailingListImpl } from "./unsubscribeFromMailingList";

export const addMailToMailingListImpl = new AddMailToMailingListImpl(
  uuidServiceImpl,
  mailingListRepoImpl
);

export const unsubscribeFromMailingListImpl =
  new UnsubscribeFromMailingListImpl(uuidServiceImpl, mailingListRepoImpl);
