import Adapter from "../../../shared/adapters/adapter";
import constants from "../../config/constants";
import { SendVerification } from "../../useCases/sendVerification";

export default class SendVerificationMiddleware extends Adapter {
  constructor(private sendVerification: SendVerification) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const sendVerificationDTO = {
      userId: req.user.id,
      email: req.user.email,
      name: req.user.name,
    };

    try {
      this.sendVerification.execute(sendVerificationDTO, {
        mode: constants.verifyMode.CODE,
      });
      next();
    } catch (error) {
      console.log(error);
    }
  }
}
