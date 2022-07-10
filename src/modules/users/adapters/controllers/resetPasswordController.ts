import Adapter from "../../../shared/adapters/adapter";
import constants from "../../config/constants";
import { ResetPassword } from "../../useCases/resetPassword";

export default class ResetPasswordController extends Adapter {
  constructor(private resetPassword: ResetPassword) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { params, body } = req;
    const resetPasswordDTO = {
      userId: params.userId,
      code: body.code,
      password: body.password,
    };

    try {
      await this.resetPassword.execute(resetPasswordDTO, {
        mode: constants.verifyMode.CODE,
      });
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      next(error);
    }
  }
}
