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

    if (policy.deny[endpoint] && policy.deny[endpoint].includes(httpMethod))
      return false;

    if (policy.allow[endpoint] && policy.allow[endpoint].includes(httpMethod))
      return true;

    if (!policy.inherits) return false;

    return this.execute({ ...endpointPermissionsDTO, role: policy.inherits });
  }
}
