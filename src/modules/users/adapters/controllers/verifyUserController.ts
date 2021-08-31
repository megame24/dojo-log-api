import Adapter from "../../../shared/adapters/adapter";
import { VerifyUser } from "../../useCases/verifyUser";

export default class VerifyUserController extends Adapter {
  constructor(private verifyUser: VerifyUser) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { userId, token } = req.params;
    const verifyUserDTO = { userId, token };

    try {
      await this.verifyUser.execute(verifyUserDTO);
      res.status(200).json({ message: "Verification successful" });
    } catch (error) {
      next(error);
    }
  }
}
