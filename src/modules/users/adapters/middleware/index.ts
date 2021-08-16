import {
  authenticateUserImpl,
  checkEndpointPermissionsImpl,
  sendVerificationImpl,
} from "../../useCases";
import AuthenticateUserMiddleware from "./authenticateUserMiddleware";
import CheckEndpointPermissionsMiddleware from "./checkEndpointPermissionsMiddleware";
import SendVerificationMiddleware from "./sendVerificationMiddleware";

export const authenticateUserMiddleware = new AuthenticateUserMiddleware(
  authenticateUserImpl
);

export const sendVerificationMiddleware = new SendVerificationMiddleware(
  sendVerificationImpl
);

export const checkEndpointPermissionsMiddleware =
  new CheckEndpointPermissionsMiddleware(checkEndpointPermissionsImpl);
