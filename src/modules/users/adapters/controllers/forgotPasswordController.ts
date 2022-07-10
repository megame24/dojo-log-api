import Adapter from "../../../shared/adapters/adapter";
import constants from "../../config/constants";
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
      const userId = await this.forgotPassword.execute(forgotPasswordDTO, {
        mode: constants.verifyMode.CODE,
      });
      res.status(200).json({ userId });
    } catch (error) {
      next(error);
    }
  }
}
