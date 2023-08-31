import { Visibility } from "../logbook/entities/logbook";
import User, { Role } from "../users/entities/user";
import UseCase from "./useCases/useCase";

export enum Operation {
  CREATE = "CREATE",
  GET_ONE = "GET_ONE",
  GET_MANY = "GET_MANY",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export interface ResourceForAccessCheck {
  name: string;
  getResource: UseCase<any, any>;
  resource?: any;
}

export interface BaseAccessProps {
  user: User;
  operation: Operation;
  resourceType: string;
  resourcesForAccessCheck: ResourceForAccessCheck[];
}

interface AccessProps extends BaseAccessProps {
  role: Role;
  policy: any;
}

export abstract class AccessControl {
  constructor() {
    this.isVerified = this.isVerified.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.isOwner = this.isOwner.bind(this);
    this.privateAccess = this.privateAccess.bind(this);
    this.privatePublicAccess = this.privatePublicAccess.bind(this);
    this.pass = this.pass.bind(this);
  }

  protected pass(user: User): boolean {
    if (!this.isVerified(user)) return false;
    return true;
  }

  protected isVerified(user: User): boolean {
    if (!user) return false;
    return <boolean>user.verified;
  }

  protected isAdmin(user: User): boolean {
    if (!user) return false;
    return user.role === Role.ADMIN;
  }

  protected isOwner(
    user: User,
    resourcesForAccessCheck: ResourceForAccessCheck[]
  ): boolean {
    if (!this.isVerified(user) || !resourcesForAccessCheck.length) return false;
    for (let i = 0; i < resourcesForAccessCheck.length; i++) {
      const resourceDetail = resourcesForAccessCheck[i];
      const { resource } = resourceDetail;
      let isOwner: boolean;

      if (Array.isArray(resource)) {
        for (let j = 0; j < resource.length; j++) {
          const childResource = resource[j];

          isOwner = [childResource.userId, childResource.id].includes(user.id);
          if (!isOwner) return false;
        }
      } else {
        isOwner = [resource.userId, resource.id].includes(user.id);
        if (!isOwner) return false;
      }
    }

    return true;
  }

  protected privateAccess(
    user: User,
    resourcesForAccessCheck: ResourceForAccessCheck[]
  ): boolean {
    if (!user || !resourcesForAccessCheck.length) return false;
    if (this.isAdmin(user)) return true;
    return this.isOwner(user, resourcesForAccessCheck);
  }

  protected privatePublicAccess(
    user: User,
    resourcesForAccessCheck: ResourceForAccessCheck[]
  ): boolean {
    if (!user || !resourcesForAccessCheck.length) return false;

    for (let i = 0; i < resourcesForAccessCheck.length; i++) {
      const resourceDetail = resourcesForAccessCheck[i];
      const { resource } = resourceDetail;
      let accessStatus: boolean;

      if (Array.isArray(resource)) {
        for (let j = 0; j < resource.length; j++) {
          const childResource = resource[j];

          if (childResource.visibility === Visibility.private) {
            accessStatus = this.privateAccess(user, [resourceDetail]);
            if (!accessStatus) return false;
          }
        }
      } else {
        if (resource.visibility === Visibility.private) {
          accessStatus = this.privateAccess(user, [resourceDetail]);
          if (!accessStatus) return false;
        }
      }
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
    const { user, policy, resourceType, resourcesForAccessCheck } = props;

    if (policy[resourceType]) {
      const resourceOperationPolicy = this.getResourceOperationPolicy(props);
      if (
        resourceOperationPolicy &&
        resourceOperationPolicy.condition(user, resourcesForAccessCheck)
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
    console.log("Not implemented, to be implemented by child classes");
    return false;
  }
}
