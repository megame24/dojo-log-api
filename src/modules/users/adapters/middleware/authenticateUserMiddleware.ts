import Adapter from "../../../shared/adapters/adapter";
import { AuthenticateUser } from "../../useCases/authenticateUser";

export default class AuthenticateUserMiddleware extends Adapter {
  constructor(private authenticateUser: AuthenticateUser) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const token = req.headers["token"];
    const authenticateUserDTO = { token };

    try {
      const user = await this.authenticateUser.execute(authenticateUserDTO);
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}
