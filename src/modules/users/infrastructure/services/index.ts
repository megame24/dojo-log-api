import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dateServiceImpl } from "../../../shared/infrastructure/services";
import { SecurityServiceImpl } from "./securityService";

export const securityServiceImpl = new SecurityServiceImpl(
  bcrypt,
  jwt,
  dateServiceImpl
);
