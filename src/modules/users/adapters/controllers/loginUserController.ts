import Adapter from "../../../shared/adapters/adapter";
import { LoginUser } from "../../useCases/loginUser";

export default class LoginUserController extends Adapter {
  constructor(private loginUser: LoginUser) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { body } = req;
    const loginUserDTO = {
      password: body.password || "",
      email: body.email,
    };

    try {
      const authToken = await this.loginUser.execute(loginUserDTO);
      res.status(200).json({ authToken });
    } catch (error) {
      next(error);
    }
  }
}
