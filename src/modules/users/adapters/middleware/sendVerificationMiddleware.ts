import { BaseAdapter } from "../../../shared/types";
import { SendVerification } from "../../useCases/sendVerification";

export default class SendVerificationMiddleware extends BaseAdapter {
  constructor(private sendVerification: SendVerification) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const sendVerificationDTO = {
      id: req.user.id,
      email: req.user.email,
    };

    try {
      await this.sendVerification.execute(sendVerificationDTO);
    } catch (error) {
      console.log(error);
    }
  }
}
