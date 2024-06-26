import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import objectSupport from "dayjs/plugin/objectSupport";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { DateServiceImpl } from "./dateService";
import { EmailServiceImpl } from "./emailService/emailService";
import { FileServiceImpl } from "./fileService";
import { UUIDServiceImpl } from "./uuidService";
import { LambdaFunctionsServiceImpl } from "./lambdaFunctionsService";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(dayOfYear);
dayjs.extend(objectSupport);

export const uuidServiceImpl = new UUIDServiceImpl(uuidv4);
export const fileServiceImpl = new FileServiceImpl(
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  getSignedUrl,
  NodeHttpHandler
);
export const dateServiceImpl = new DateServiceImpl(dayjs);
export const lambdaFunctionsServiceImpl = new LambdaFunctionsServiceImpl(
  LambdaClient,
  InvokeCommand
);
export const emailServiceImpl = new EmailServiceImpl(
  lambdaFunctionsServiceImpl
);
