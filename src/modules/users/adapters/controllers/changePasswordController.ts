import Adapter from "../../../shared/adapters/adapter";
import { ChangePassword } from "../../useCases/changePassword";

export default class ChangePasswordController extends Adapter {
  constructor(private changePassword: ChangePassword) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const {
      user,
      body: { oldPassword, newPassword },
    } = req;
    const changePasswordDTO = { user, oldPassword, newPassword };

    try {
      await this.changePassword.execute(changePasswordDTO);

      res.status(200).json({ message: "Password changed successfully " });
    } catch (error) {
      next(error);
    }
  }
}
