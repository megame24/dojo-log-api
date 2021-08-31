import { Role } from "../users/api";

interface PermissionProps {
  role: Role;
  endpointPolicy: any;
  endpoint: string;
  httpMethod: string;
}

export default class EndpointPermission {
  static hasPermission(params: PermissionProps): boolean {
    const { endpointPolicy, endpoint, httpMethod } = params;
    let { role } = params;

    const policy = endpointPolicy[role];
    const deny = policy.deny;
    const allow = policy.allow;

    if (deny[endpoint] && deny[endpoint].includes(httpMethod)) return false;

    if (allow[endpoint] && allow[endpoint].includes(httpMethod)) return true;

    if (!policy.inherits) return false;

    role = policy.inherits;
    return this.hasPermission({ ...params, role });
  }
}
