import { BaseAdapter } from "../../../shared/core/types";
import { SendVerification } from "../../useCases/sendVerification";

export default class SendVerificationController extends BaseAdapter {
  constructor(private sendVerification: SendVerification) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const sendVerificationDTO = {
      id: req.params.id,
      email: req.user.email,
    };

    try {
      await this.sendVerification.execute(sendVerificationDTO);
      res.status(200).json({ message: "Verification mail sent" });
    } catch (error) {
      next(error);
    }
  }
}
