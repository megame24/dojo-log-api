import { dateServiceImpl } from "../../../shared/infrastructure/services";
import { authenticateUserImpl, sendVerificationImpl } from "../../useCases";
import AuthenticateUserMiddleware from "./authenticateUserMiddleware";
import SendVerificationMiddleware from "./sendVerificationMiddleware";

export const authenticateUserMiddleware = new AuthenticateUserMiddleware(
  authenticateUserImpl,
  dateServiceImpl
);

export const sendVerificationMiddleware = new SendVerificationMiddleware(
  sendVerificationImpl
);
