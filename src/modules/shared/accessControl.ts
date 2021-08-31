import { LogbookVisibility } from "../logbook/api";
import { User, Role } from "../users/api";

export enum Operation {
  CREATE = "CREATE",
  GET = "GET",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export interface BaseAccessProps {
  user: User;
  operation: Operation;
  resourceType: string;
  resource?: any;
}

interface AccessProps extends BaseAccessProps {
  role: Role;
  policy: any;
}

export abstract class AccessControl {
  protected pass(): boolean {
    return true;
  }

  protected isAdmin(user: User): boolean {
    if (!user) return false;
    return user.role === Role.ADMIN;
  }

  protected isOwner(user: User, resource: any): boolean {
    if (!user || !resource) return false;
    return user.id === resource.userId;
  }

  protected privateAccess(user: User, resource: any): boolean {
    if (!user || !resource) return false;
    return this.isAdmin(user) || this.isOwner(user, resource);
  }

  protected privatePublicAccess(user: User, resource: any): boolean {
    if (!user || !resource) return false;
    if (resource.visibility === LogbookVisibility.private) {
      return this.privateAccess(user, resource);
    }
    return true;
  }

  protected getResourceOperationPolicy(params: AccessProps) {
    const { policy, resourceType, operation } = params;

    return policy[resourceType].find(
      (elem: any) => elem.operation === operation
    );
  }

  protected checkAccess(params: AccessProps): boolean {
    const { user, policy, resourceType, resource } = params;

    if (policy[resourceType]) {
      const resourceOperationPolicy = this.getResourceOperationPolicy(params);
      if (
        resourceOperationPolicy &&
        resourceOperationPolicy.condition(user, resource)
      )
        return true;
    }
    return false;
  }

  protected _hasAccess(params: AccessProps): boolean {
    const { policy } = params;
    let { role } = params;

    const policyByRole = policy[role];
    const deny = policyByRole.deny;
    const allow = policyByRole.allow;

    if (this.checkAccess({ ...params, policy: deny })) return false;

    if (this.checkAccess({ ...params, policy: allow })) return true;

    if (!policyByRole.inherits) return false;

    role = policyByRole.inherits;
    return this._hasAccess({ ...params, role });
  }

  hasAccess(params: BaseAccessProps): boolean {
    console.log("Not implemented");
    return false;
  }
}
