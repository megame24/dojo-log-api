import Adapter from "../../../shared/adapters/adapter";
import { DateService } from "../../../shared/infrastructure/services/dateService";
import { AuthenticateUser } from "../../useCases/authenticateUser";

export default class AuthenticateUserMiddleware extends Adapter {
  constructor(
    private authenticateUser: AuthenticateUser,
    private dateService: DateService
  ) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { token, authorization, timezone } = req.headers;

    const incomingHmac = authorization ? authorization.split(" ")[1] : null;

    const authenticateUserDTO = { token, incomingHmac, queryParams: req.query };
    this.dateService.timezone = timezone;

    try {
      const user = await this.authenticateUser.execute(authenticateUserDTO);
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}
