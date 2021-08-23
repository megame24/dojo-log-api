import { v4 as uuidv4 } from "uuid";
import { DateServiceImpl } from "../../../logbook/infrastructure/services/dateService";
import { EmailServiceImpl } from "./emailService";
import { UUIDServiceImpl } from "./uuidService";

export const emailServiceImpl = new EmailServiceImpl();
export const uuidServiceImpl = new UUIDServiceImpl(uuidv4);
export const dateServiceImpl = new DateServiceImpl();
