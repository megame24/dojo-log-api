import {
  AccessControl,
  BaseAccessProps,
  Operation,
} from "../shared/accessControl";
import { Role } from "./entities/user";

// TODO: write a documentation for this!!!!
// TODO: make everything private access for first release!

class UserAccessControl extends AccessControl {
  private policy: any = {
    ADMIN: {
      inherits: Role.USER,
      allow: {},
      deny: {},
    },
    USER: {
      inherits: Role.GUEST,
      allow: {
        profile: [
          {
            operation: Operation.GET_ONE,
            condition: this.privateAccess,
          },
          {
            operation: Operation.UPDATE,
            condition: this.privateAccess,
          },
        ],
      },
      deny: {
        sendVerification: [
          {
            operation: Operation.GET_ONE,
            condition: this.pass,
          },
        ],
        verify: [
          {
            operation: Operation.UPDATE,
            condition: this.pass,
          },
        ],
        register: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
        ],
        login: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
        ],
        forgotPassword: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
        ],
      },
    },
    GUEST: {
      inherits: "",
      allow: {
        sendVerification: [
          {
            operation: Operation.GET_ONE,
            condition: this.pass,
          },
        ],
        verify: [
          {
            operation: Operation.UPDATE,
            condition: this.pass,
          },
        ],
        register: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
        ],
        login: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
        ],
        googleSignInVerify: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
        ],
        forgotPassword: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
        ],
        resetPassword: [
          {
            operation: Operation.UPDATE,
            condition: this.pass,
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

export const userAccessControl = new UserAccessControl();
