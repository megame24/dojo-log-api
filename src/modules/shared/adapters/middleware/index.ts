import AccessControlMiddleware from "./accessControlMiddleware";
import EndpointPermissionsMiddleware from "./endpointPermissionsMiddleware";

export const endpointPermissionsMiddleware =
  new EndpointPermissionsMiddleware();
export const accessControlMiddleware = new AccessControlMiddleware();
