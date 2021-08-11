import { BaseAdapter } from "../../../shared/core/types";
import { ResetPassword } from "../../useCases/resetPassword";

export default class ResetPasswordController extends BaseAdapter {
  constructor(private resetPassword: ResetPassword) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { id, token } = req.params;
    const resetPasswordDTO = {
      userId: id,
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
