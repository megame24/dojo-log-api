import {
  addMailToMailingListImpl,
  sendMailToAllSubscribersImpl,
  unsubscribeFromMailingListImpl,
} from "../../useCases";
import AddMailToMailingListController from "./addMailToMailingListController";
import SendMailToAllSubscribersController from "./sendMailToAllSubscribersController";
import UnsubscribeFromMailingListController from "./unsubscribeFromMailingListController";

export const addMailToMailingListController =
  new AddMailToMailingListController(addMailToMailingListImpl);

export const unsubscribeFromMailingListController =
  new UnsubscribeFromMailingListController(unsubscribeFromMailingListImpl);

export const sendMailToAllSubscribersController =
  new SendMailToAllSubscribersController(sendMailToAllSubscribersImpl);
