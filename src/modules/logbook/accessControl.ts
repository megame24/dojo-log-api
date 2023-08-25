import {
  AccessControl,
  BaseAccessProps,
  Operation,
} from "../shared/accessControl";
import { Role } from "../users/entities/user";

// TODO: write a documentation for this!!!!
// TODO: make everything private access for first release!

class LogbookAccessControl extends AccessControl {
  private policy: any = {
    ADMIN: {
      inherits: Role.USER,
      allow: {
        categories: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
          {
            operation: Operation.DELETE,
            condition: this.pass,
          },
          {
            operation: Operation.UPDATE,
            condition: this.pass,
          },
        ],
      },
      deny: {},
    },
    USER: {
      inherits: Role.GUEST,
      allow: {
        categories: [
          {
            operation: Operation.GET_MANY,
            condition: this.pass,
          },
        ],
        files: [
          {
            operation: Operation.DELETE,
            condition: this.privateAccess,
          },
        ],
        rewards: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
          {
            operation: Operation.UPDATE,
            condition: this.privateAccess,
          },
          {
            operation: Operation.GET_MANY,
            condition: this.pass,
          },
          {
            operation: Operation.DELETE,
            condition: this.privateAccess,
          },
        ],
        logbooks: [
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
          {
            operation: Operation.GET_ONE,
            condition: this.privatePublicAccess,
          },
        ],
        earliestLogbookYear: [
          {
            operation: Operation.GET_ONE,
            condition: this.pass,
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
            operation: Operation.GET_ONE,
            condition: this.privatePublicAccess,
          },
          {
            operation: Operation.GET_MANY,
            condition: this.pass,
          },
        ],
        logs: [
          {
            operation: Operation.GET_MANY,
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
