import Adapter from "../../../shared/adapters/adapter";
import { RegisterUser } from "../../useCases/registerUser";

export default class RegisterUserController extends Adapter {
  constructor(private registerUser: RegisterUser) {
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
      const user = await this.registerUser.execute(registerUserDTO);
      res.status(201).json({ userId: user.id });
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}
