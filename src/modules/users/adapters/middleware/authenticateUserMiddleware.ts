import { BaseAdapter } from "../../../shared/core/types";
import { AuthenticateUser } from "../../useCases/authenticateUser";

export default class AuthenticateUserMiddleware extends BaseAdapter {
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
