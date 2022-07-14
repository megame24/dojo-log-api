import Adapter from "../../../shared/adapters/adapter";
import constants from "../../config/constants";
import { VerifyUser } from "../../useCases/verifyUser";

export default class VerifyUserController extends Adapter {
  constructor(private verifyUser: VerifyUser) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { body, params } = req;
    const verifyUserDTO = {
      userId: params.userId,
      code: body.code,
    };

    try {
      const authToken = await this.verifyUser.execute(verifyUserDTO, {
        mode: constants.verifyMode.CODE,
      });
      res.status(200).json({ authToken });
    } catch (error) {
      next(error);
    }
  }
}
