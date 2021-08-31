import AppError from "../../AppError";
import Adapter from "../adapter";
import EndpointPermission from "../../endpointPermission";

export default class EndpointPermissionsMiddleware extends Adapter {
  constructor() {
    super();
  }

  executeWrapper(endpointPolicy: any) {
    return (req: any, res: any, next: any) => {
      const { role } = req.user;
      const endpoint = req.baseUrl + req.route.path;
      const httpMethod = req.method;

      try {
        const hasPermission = EndpointPermission.hasPermission({
          role,
          endpointPolicy,
          endpoint,
          httpMethod,
        });
        if (!hasPermission) throw AppError.forbiddenError();
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
