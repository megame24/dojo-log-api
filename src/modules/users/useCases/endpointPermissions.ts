import UseCase from "../../shared/useCases/useCase";
import { Role } from "../entities/user";

interface EndpointPermissionsDTO {
  role: Role;
  endpointPolicy: any;
  endpoint: string;
  httpMethod: string;
}

export interface EndpointPermissions
  extends UseCase<EndpointPermissionsDTO, boolean> {
  execute: (endpointPermissionsDTO: EndpointPermissionsDTO) => boolean;
}

export class EndpointPermissionsImpl implements EndpointPermissions {
  execute(endpointPermissionsDTO: EndpointPermissionsDTO): boolean {
    const { role, endpointPolicy, endpoint, httpMethod } =
      endpointPermissionsDTO;

    const policy = endpointPolicy[role];
    let hasPermission = false;

    if (policy[endpoint] && policy[endpoint].includes(httpMethod)) {
      hasPermission = true;
    }

    return hasPermission;
  }
}
