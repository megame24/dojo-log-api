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
        category: [
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
        logbook: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
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
      },
      deny: {},
    },
    GUEST: {
      inherits: "",
      allow: {
        logbook: [
          {
            operation: Operation.GET,
            condition: this.privatePublicAccess,
          },
        ],
      },
      deny: {},
    },
  };

  hasAccess(params: BaseAccessProps): boolean {
    return this._hasAccess({
      ...params,
      role: <Role>params.user.role,
      policy: this.policy,
    });
  }
}

export const logBookAccessControl = new LogbookAccessControl();
