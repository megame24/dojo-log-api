import models from "../../../shared/infrastructure/database/models";
import { uuidServiceImpl } from "../../../shared/infrastructure/services";
import { MailingListRepoImpl } from "./mailingListRepo";

const { MailingList } = <any>models;

export const mailingListRepoImpl = new MailingListRepoImpl(
  MailingList,
  uuidServiceImpl
);
