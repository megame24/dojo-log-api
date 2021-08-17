import Adapter from "../../../shared/adapters/adapter";
import { ForgotPassword } from "../../useCases/forgotPassword";

export default class ForgotPasswordController extends Adapter {
  constructor(private forgotPassword: ForgotPassword) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const forgotPasswordDTO = {
      email: req.body.email,
    };

    try {
      await this.forgotPassword.execute(forgotPasswordDTO);
      res.status(200).json({ message: "Reset password mail sent" });
    } catch (error) {
      next(error);
    }
  }
}
