import Adapter from "../../../shared/adapters/adapter";
import { AppleSignInVerify } from "../../useCases/appleSignInVerify";

export default class AppleSignInVerifyController extends Adapter {
  constructor(private appleSignInVerify: AppleSignInVerify) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { idToken, appleUserFullName } = req.body;
    const appleSignInVerifyDTO = { idToken, appleUserFullName };

    try {
      const { authToken, user } = await this.appleSignInVerify.execute(
        appleSignInVerifyDTO
      );
      res.status(200).json({ authToken });
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}
