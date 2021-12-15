import {
  AccessControl,
  BaseAccessProps,
  Operation,
} from "../shared/accessControl";
import { Role } from "../users/api";

// INCLUDE CHECKING FOR VERIFIED!!!!

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
        ],
        log: [
          {
            operation: Operation.CREATE,
            condition: this.privateAccess,
          },
        ],
        goal: [
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
