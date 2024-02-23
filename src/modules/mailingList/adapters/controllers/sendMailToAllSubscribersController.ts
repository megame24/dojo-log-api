import Adapter from "../../../shared/adapters/adapter";
import { SendMailToAllSubscribers } from "../../useCases/sendMailToAllSubscribers";

export default class SendMailToAllSubscribersController extends Adapter {
  constructor(private sendMailToAllSubscribers: SendMailToAllSubscribers) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { emailTemplateId } = req.body;
    const sendMailToAllSubscribersDTO = { emailTemplateId };

    try {
      await this.sendMailToAllSubscribers.execute(sendMailToAllSubscribersDTO);
      res.status(200).json({ message: "Bulk email sent successfully" });
    } catch (error) {
      next(error);
    }
  }
}
