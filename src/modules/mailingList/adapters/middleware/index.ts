import { addMailToMailingListImpl } from "../../useCases";
import AddMailToMailingListMiddleware from "./addMailToMailingListMiddleware";

export const addMailToMailingListMiddleware =
  new AddMailToMailingListMiddleware(addMailToMailingListImpl);
