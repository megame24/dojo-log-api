import {
  AccessControl,
  BaseAccessProps,
  Operation,
} from "../shared/accessControl";
import { Role } from "../users/api";

class LogbookAccessControl extends AccessControl {
  private policy: any = {
    ADMIN: {
      inherits: "USER",
      allow: {
        categories: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
        ],
      },
      deny: {},
    },
    USER: {
      inherits: "GUEST",
      allow: {
        logbooks: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
        ],
        logs: [
          {
            operation: Operation.CREATE,
            condition: this.privateAccess,
          },
          {
            operation: Operation.UPDATE,
            condition: this.privateAccess,
          },
          {
            operation: Operation.DELETE,
            condition: this.privateAccess,
          },
        ],
        goals: [
          {
            operation: Operation.CREATE,
            condition: this.privateAccess,
          },
          {
            operation: Operation.UPDATE,
            condition: this.privateAccess,
          },
        ],
      },
      deny: {},
    },
    GUEST: {
      inherits: "",
      allow: {
        logbooks: [
          {
            operation: Operation.GET,
            condition: this.privatePublicAccess,
          },
        ],
        logs: [
          {
            operation: Operation.GET,
            condition: this.privatePublicAccess,
          },
        ],
      },
      deny: {},
    },
  };

  constructor() {
    super();
  }

  hasAccess(params: BaseAccessProps): boolean {
    return this._hasAccess({
      ...params,
      role: <Role>params.user.role,
      policy: this.policy,
    });
  }
}

export const logbookAccessControl = new LogbookAccessControl();
