import AppError from "../../../shared/AppError";
import Adapter from "../../../shared/adapters/adapter";
import { EndpointPermissions } from "../../useCases/endpointPermissions";

export default class EndpointPermissionsMiddleware extends Adapter {
  constructor(private endpointPermissions: EndpointPermissions) {
    super();
  }

  executeWrapper(endpointPolicy: any) {
    return (req: any, res: any, next: any) => {
      const { role } = req.user;
      const endpoint = req.baseUrl + req.route.path;
      const httpMethod = req.method;
      const endpointPermissionsDTO = {
        role,
        endpoint,
        httpMethod,
        endpointPolicy,
      };

      try {
        const hasPermission = this.endpointPermissions.execute(
          endpointPermissionsDTO
        );
        if (!hasPermission) throw AppError.forbiddenError();
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
