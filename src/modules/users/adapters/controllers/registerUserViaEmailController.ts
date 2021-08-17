import Adapter from "../../../shared/adapters/adapter";
import { RegisterUserViaEmail } from "../../useCases/registerUserViaEmail";

export default class RegisterUserViaEmailController extends Adapter {
  constructor(private registerUserViaEmail: RegisterUserViaEmail) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { username, password, email, name } = req.body;
    const registerUserDTO = {
      username: username,
      password: password,
      email: email,
      name: name,
    };

    try {
      const { user, authToken } = await this.registerUserViaEmail.execute(
        registerUserDTO
      );
      res.status(201).json({ authToken });
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}
