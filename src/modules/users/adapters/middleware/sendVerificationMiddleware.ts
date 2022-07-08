import Adapter from "../../../shared/adapters/adapter";
import { constants, SendVerification } from "../../useCases/sendVerification";

export default class SendVerificationMiddleware extends Adapter {
  constructor(private sendVerification: SendVerification) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const sendVerificationDTO = {
      userId: req.user.id,
      email: req.user.email,
    };

    try {
      await this.sendVerification.execute(sendVerificationDTO, {
        mode: constants.useCaseMode.CODE,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
