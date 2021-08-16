import AppError from "../../../shared/AppError";
import { BaseAdapter } from "../../../shared/types";
import { CheckEndpointPermissions } from "../../useCases/checkEndpointPermissions";

export default class CheckEndpointPermissionsMiddleware extends BaseAdapter {
  constructor(private checkEndpointPermissions: CheckEndpointPermissions) {
    super();
  }

  executeWrapper(endpointPolicy: any) {
    return (req: any, res: any, next: any) => {
      const { role } = req.user;
      const endpoint = req.route.path;
      const httpMethod = req.method;
      const checkEndpointPermissionsDTO = {
        role,
        endpoint,
        httpMethod,
        endpointPolicy,
      };

      try {
        const hasPermission = this.checkEndpointPermissions.execute(
          checkEndpointPermissionsDTO
        );
        if (!hasPermission) throw AppError.forbiddenError();
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
