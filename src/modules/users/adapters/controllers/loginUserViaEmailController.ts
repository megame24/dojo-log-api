import Adapter from "../../../shared/adapters/adapter";
import { LoginUserViaEmail } from "../../useCases/loginUserViaEmail";

export default class LoginUserViaEmailController extends Adapter {
  constructor(private loginUserViaEmail: LoginUserViaEmail) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { body } = req;
    const loginUserDTO = {
      password: body.password || "",
      email: body.email,
    };

    try {
      const authToken = await this.loginUserViaEmail.execute(loginUserDTO);
      res.status(200).json({ authToken });
    } catch (error) {
      next(error);
    }
  }
}
