import {
  authenticateUserImpl,
  endpointPermissionsImpl,
  sendVerificationImpl,
} from "../../useCases";
import AuthenticateUserMiddleware from "./authenticateUserMiddleware";
import EndpointPermissionsMiddleware from "./endpointPermissionsMiddleware";
import SendVerificationMiddleware from "./sendVerificationMiddleware";

export const authenticateUserMiddleware = new AuthenticateUserMiddleware(
  authenticateUserImpl
);

export const sendVerificationMiddleware = new SendVerificationMiddleware(
  sendVerificationImpl
);

export const endpointPermissionsMiddleware = new EndpointPermissionsMiddleware(
  endpointPermissionsImpl
);
