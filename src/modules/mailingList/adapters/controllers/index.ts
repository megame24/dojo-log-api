import {
  addMailToMailingListImpl,
  unsubscribeFromMailingListImpl,
} from "../../useCases";
import AddMailToMailingListController from "./addMailToMailingListController";
import UnsubscribeFromMailingListController from "./unsubscribeFromMailingListController";

export const addMailToMailingListController =
  new AddMailToMailingListController(addMailToMailingListImpl);

export const unsubscribeFromMailingListController =
  new UnsubscribeFromMailingListController(unsubscribeFromMailingListImpl);
