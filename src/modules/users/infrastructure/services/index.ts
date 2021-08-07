import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { SecurityServiceImpl } from "./securityService";
import { UUIDServiceImpl } from "./uuidService";
import dotenv from "dotenv";

dotenv.config();

export const securityServiceImpl = new SecurityServiceImpl(bcrypt, jwt);
export const uuidServiceImpl = new UUIDServiceImpl(uuidv4);
