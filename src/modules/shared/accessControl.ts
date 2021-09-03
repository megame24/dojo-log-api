import { Visibility } from "../logbook/api";
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
  resourceOrParent?: any;
}

interface AccessProps extends BaseAccessProps {
  role: Role;
  policy: any;
}

export abstract class AccessControl {
  constructor() {
    this.isAdmin = this.isAdmin.bind(this);
    this.isOwner = this.isOwner.bind(this);
    this.privateAccess = this.privateAccess.bind(this);
  }

  protected pass(): boolean {
    return true;
  }

  protected isAdmin(user: User): boolean {
    if (!user) return false;
    return user.role === Role.ADMIN;
  }

  protected isOwner(user: User, resourceOrParent: any): boolean {
    if (!user || !resourceOrParent) return false;
    return user.id === resourceOrParent.userId;
  }

  protected privateAccess(user: User, resourceOrParent: any): boolean {
    if (!user || !resourceOrParent) return false;
    return this.isAdmin(user) || this.isOwner(user, resourceOrParent);
  }

  protected privatePublicAccess(user: User, resourceOrParent: any): boolean {
    if (!user || !resourceOrParent) return false;
    if (resourceOrParent.visibility === Visibility.private) {
      return this.privateAccess(user, resourceOrParent);
    }
    return true;
  }

  protected getResourceOperationPolicy(props: AccessProps) {
    const { policy, resourceType, operation } = props;

    return policy[resourceType].find(
      (elem: any) => elem.operation === operation
    );
  }

  protected checkAccess(props: AccessProps): boolean {
    const { user, policy, resourceType, resourceOrParent } = props;

    if (policy[resourceType]) {
      const resourceOperationPolicy = this.getResourceOperationPolicy(props);
      if (
        resourceOperationPolicy &&
        resourceOperationPolicy.condition(user, resourceOrParent)
      )
        return true;
    }
    return false;
  }

  protected _hasAccess(props: AccessProps): boolean {
    const { policy } = props;
    let { role } = props;

    const policyByRole = policy[role];
    const deny = policyByRole.deny;
    const allow = policyByRole.allow;

    if (this.checkAccess({ ...props, policy: deny })) return false;

    if (this.checkAccess({ ...props, policy: allow })) return true;

    if (!policyByRole.inherits) return false;

    role = policyByRole.inherits;
    return this._hasAccess({ ...props, role });
  }

  hasAccess(props: BaseAccessProps): boolean {
    console.log("Not implemented");
    return false;
  }
}
