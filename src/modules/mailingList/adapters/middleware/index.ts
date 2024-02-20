import { addMailToMailingListImpl, sendSingleMailImpl } from "../../useCases";
import AddMailToMailingListMiddleware from "./addMailToMailingListMiddleware";
import SendSubscribedToMailingListEmailMiddleware from "./sendSubscribedToMailingListEmailMiddleware";

export const addMailToMailingListMiddleware =
  new AddMailToMailingListMiddleware(addMailToMailingListImpl);

export const sendSubscribedToMailingListEmailMiddleware =
  new SendSubscribedToMailingListEmailMiddleware(sendSingleMailImpl);
