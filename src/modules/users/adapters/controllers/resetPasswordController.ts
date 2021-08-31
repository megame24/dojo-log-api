import Adapter from "../../../shared/adapters/adapter";
import { ResetPassword } from "../../useCases/resetPassword";

export default class ResetPasswordController extends Adapter {
  constructor(private resetPassword: ResetPassword) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { userId, token } = req.params;
    const resetPasswordDTO = {
      userId,
      token,
      password: req.body.password,
    };

    try {
      await this.resetPassword.execute(resetPasswordDTO);
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      next(error);
    }
  }
}
