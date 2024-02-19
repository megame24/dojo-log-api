import Adapter from "../../../shared/adapters/adapter";
import { GoogleSignInVerify } from "../../useCases/googleSignInVerify";

export default class GoogleSignInVerifyController extends Adapter {
  constructor(private googleSignInVerify: GoogleSignInVerify) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { idToken } = req.body;
    const googleSignInVerifyDTO = { idToken };

    try {
      const { authToken, user } = await this.googleSignInVerify.execute(
        googleSignInVerifyDTO
      );
      res.status(200).json({ authToken });
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}
