import { BaseAdapter } from "../../../shared/core/types";
import { RegisterUserViaEmail } from "../../useCases/registerUserViaEmail";

export default class RegisterUserViaEmailController extends BaseAdapter {
  constructor(private registerUserViaEmail: RegisterUserViaEmail) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { body } = req;
    const registerUserDTO = {
      username: body.username,
      password: body.password,
      email: body.email,
      name: body.name,
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
