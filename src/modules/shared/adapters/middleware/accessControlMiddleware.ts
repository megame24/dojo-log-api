import { Operation, AccessControl } from "../../accessControl";
import AppError from "../../AppError";
import UseCase from "../../useCases/useCase";
import Adapter from "../adapter";

export default class AccessControlMiddleware extends Adapter {
  constructor() {
    super();
  }

  executeWrapper(props: {
    accessControl: AccessControl;
    operation: Operation;
    resourceType: string;
    getResourceOrParent?: UseCase<any, any>;
  }) {
    return async (req: any, res: any, next: any) => {
      try {
        let resourceOrParent;
        if (props.getResourceOrParent) {
          resourceOrParent = await props.getResourceOrParent.execute({
            ...req.body,
            ...req.params,
            userId: req.user.id,
          });
        }

        const accessProps = {
          user: req.user,
          operation: props.operation,
          resourceType: props.resourceType,
          resourceOrParent,
        };

        const hasAccess = props.accessControl.hasAccess(accessProps);
        if (!hasAccess) throw AppError.forbiddenError();

        req.resourceOrParent = resourceOrParent;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
