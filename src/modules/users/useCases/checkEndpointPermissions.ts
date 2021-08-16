import { UseCase } from "../../shared/types";
import { Role } from "../entities/user";

interface CheckEndpointPermissionsDTO {
  role: Role;
  endpointPolicy: any;
  endpoint: string;
  httpMethod: string;
}

export interface CheckEndpointPermissions
  extends UseCase<CheckEndpointPermissionsDTO, boolean> {
  execute: (
    checkEndpointPermissionsDTO: CheckEndpointPermissionsDTO
  ) => boolean;
}

export class CheckEndpointPermissionsImpl implements CheckEndpointPermissions {
  execute(checkEndpointPermissionsDTO: CheckEndpointPermissionsDTO): boolean {
    const { role, endpointPolicy, endpoint, httpMethod } =
      checkEndpointPermissionsDTO;

    const policy = endpointPolicy[role];
    let hasPermission = false;

    if (policy[endpoint] && policy[endpoint].includes(httpMethod)) {
      hasPermission = true;
    }

    return hasPermission;
  }
}
