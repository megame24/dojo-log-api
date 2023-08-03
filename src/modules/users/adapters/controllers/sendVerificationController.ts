import Adapter from "../../../shared/adapters/adapter";
import constants from "../../config/constants";
import { SendVerification } from "../../useCases/sendVerification";

export default class SendVerificationController extends Adapter {
  constructor(private sendVerification: SendVerification) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { user, params } = req;
    const sendVerificationDTO = {
      userId: params.userId,
      email: user.email,
      name: user.name,
    };

    try {
      await this.sendVerification.execute(sendVerificationDTO, {
        mode: constants.verifyMode.CODE,
      });
      res.status(200).json({ message: "Verification mail sent" });
    } catch (error) {
      next(error);
    }
  }
}
