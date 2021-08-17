import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SecurityServiceImpl } from "./securityService";

export const securityServiceImpl = new SecurityServiceImpl(bcrypt, jwt);
