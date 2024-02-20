import Adapter from "../../../shared/adapters/adapter";
import { ImplicitEmailTemplateIds } from "../../../shared/infrastructure/services/emailService/emailTemplates";
import { SendSingleMail } from "../../useCases/sendSingleMail";

export default class SendSubscribedToMailingListEmailMiddleware extends Adapter {
  constructor(private sendSingleMail: SendSingleMail) {
    super();
  }

  async execute(req: any) {
    const { email } = req.body;
    const emailTemplateId =
      ImplicitEmailTemplateIds.subscribedToMailListTemplate;
    const sendSingleMailDTO = { email, emailTemplateId };

    try {
      this.sendSingleMail.execute(sendSingleMailDTO);
    } catch (error) {
      console.log(error);
    }
  }
}
