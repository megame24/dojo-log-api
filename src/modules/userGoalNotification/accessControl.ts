import {
  AccessControl,
  BaseAccessProps,
  Operation,
} from "../shared/accessControl";
import { Role } from "../users/entities/user";

// TODO: write a documentation for this!!!!
// TODO: make everything private access for first release!

class UserGoalNotificationAccessControl extends AccessControl {
  private policy: any = {
    BOT: {
      inherits: "",
      allow: {
        userGoalNotifications: [
          {
            operation: Operation.GET_MANY,
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

export const userGoalNotificationAccessControl =
  new UserGoalNotificationAccessControl();
