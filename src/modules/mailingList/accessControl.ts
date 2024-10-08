import {
  AccessControl,
  BaseAccessProps,
  Operation,
} from "../shared/accessControl";
import { Role } from "../users/entities/user";

// TODO: write a documentation for this!!!!
// TODO: make everything private access for first release!

class MailingListAccessControl extends AccessControl {
  private policy: any = {
    ADMIN: {
      inherits: Role.USER,
      allow: {
        subscribers: [
          {
            operation: Operation.CREATE,
            condition: this.pass,
          },
          {
            operation: Operation.GET_MANY,
            condition: this.pass,
          },
        ],
      },
      deny: {},
    },
    USER: {
      inherits: Role.GUEST,
      allow: {},
      deny: {},
    },
    GUEST: {
      inherits: "",
      allow: {
        mailingList: [
          {
            operation: Operation.CREATE,
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

export const mailingListAccessControl = new MailingListAccessControl();
