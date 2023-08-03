import {
  Operation,
  AccessControl,
  ResourceForAccessCheck,
} from "../../accessControl";
import AppError from "../../AppError";
import Adapter from "../adapter";

export default class AccessControlMiddleware extends Adapter {
  constructor() {
    super();
  }

  executeWrapper(props: {
    accessControl: AccessControl;
    operation: Operation;
    resourceType: string;
    resourcesForAccessCheck: ResourceForAccessCheck[];
  }) {
    return async (req: any, res: any, next: any) => {
      try {
        const { resourcesForAccessCheck } = props;

        const resourcesPromise = resourcesForAccessCheck.map(
          (resourceDetails) => {
            return resourceDetails.getResource.execute({
              userId: req.user.id,
              ...req.body,
              ...req.params,
            });
          }
        );
        const resolvedResources = await Promise.all(resourcesPromise);

        resolvedResources?.forEach((resource, i) => {
          resourcesForAccessCheck[i].resource = resource;
        });

        const accessProps = {
          user: req.user,
          operation: props.operation,
          resourceType: props.resourceType,
          resourcesForAccessCheck,
        };

        const hasAccess = props.accessControl.hasAccess(accessProps);
        if (!hasAccess) throw AppError.forbiddenError();

        resourcesForAccessCheck.forEach((resourceDetail) => {
          req[resourceDetail.name] = resourceDetail.resource;
        });
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
