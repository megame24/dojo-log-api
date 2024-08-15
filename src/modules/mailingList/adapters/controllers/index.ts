import {
  addMailToMailingListImpl,
  getAllSubscribersEmailsImpl,
  sendMailToAllSubscribersImpl,
  unsubscribeFromMailingListImpl,
} from "../../useCases";
import AddMailToMailingListController from "./addMailToMailingListController";
import GetAllSubscribersEmailsController from "./getAllSubscribersEmailsController";
import SendMailToAllSubscribersController from "./sendMailToAllSubscribersController";
import UnsubscribeFromMailingListController from "./unsubscribeFromMailingListController";

export const addMailToMailingListController =
  new AddMailToMailingListController(addMailToMailingListImpl);

export const unsubscribeFromMailingListController =
  new UnsubscribeFromMailingListController(unsubscribeFromMailingListImpl);

export const sendMailToAllSubscribersController =
  new SendMailToAllSubscribersController(sendMailToAllSubscribersImpl);

export const getAllSubscribersEmailsController =
  new GetAllSubscribersEmailsController(getAllSubscribersEmailsImpl);
