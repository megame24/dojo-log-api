import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { DateServiceImpl } from "./dateService";
import { EmailServiceImpl } from "./emailService";
import { FileServiceImpl } from "./fileService";
import { UUIDServiceImpl } from "./uuidService";

export const emailServiceImpl = new EmailServiceImpl();
export const uuidServiceImpl = new UUIDServiceImpl(uuidv4);
export const fileServiceImpl = new FileServiceImpl();
export const dateServiceImpl = new DateServiceImpl(dayjs);
