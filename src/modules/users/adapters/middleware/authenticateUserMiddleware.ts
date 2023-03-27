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
    const { token, timezone } = req.headers;
    const authenticateUserDTO = { token };
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
