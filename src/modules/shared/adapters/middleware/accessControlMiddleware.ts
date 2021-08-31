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
    getResource?: UseCase<any, any>;
  }) {
    return async (req: any, res: any, next: any) => {
      try {
        let resource;
        if (props.getResource) {
          resource = await props.getResource.execute({
            ...req.body,
            ...req.params,
            userId: req.user.id,
          });
        }

        const accessProps = {
          user: req.user,
          operation: props.operation,
          resourceType: props.resourceType,
          resource,
        };

        const hasAccess = props.accessControl.hasAccess(accessProps);
        if (!hasAccess) throw AppError.forbiddenError();

        req.resource = resource;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
