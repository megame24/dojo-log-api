import {
  LoginUserViaEmail,
  LoginUserDTO,
} from "../../useCases/loginUserViaEmail";

export default class LoginUserViaEmailController {
  constructor(private loginUserViaEmail: LoginUserViaEmail) {}

  async execute(req: any, res: any, next: any) {
    const { body } = req;
    const loginUserDTO: LoginUserDTO = {
      password: body.password || "",
      email: body.email,
    };

    try {
      const authToken = await this.loginUserViaEmail.execute(loginUserDTO);
      return res.status(200).json({ authToken });
    } catch (error) {
      next(error);
    }
  }
}
