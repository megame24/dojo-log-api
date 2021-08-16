import { BaseAdapter } from "../../../shared/types";
import { VerifyUser } from "../../useCases/verifyUser";

export default class VerifyUserController extends BaseAdapter {
  constructor(private verifyUser: VerifyUser) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { id, token } = req.params;
    const verifyUserDTO = { userId: id, token };

    try {
      await this.verifyUser.execute(verifyUserDTO);
      res.status(200).json({ message: "Verification successful" });
    } catch (error) {
      next(error);
    }
  }
}
