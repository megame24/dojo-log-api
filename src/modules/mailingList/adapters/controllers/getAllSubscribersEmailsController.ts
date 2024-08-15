import Adapter from "../../../shared/adapters/adapter";
import { GetAllSubscribersEmails } from "../../useCases/getAllSubscribersEmails";

export default class GetAllSubscribersEmailsController extends Adapter {
  constructor(private getAllSubscribersEmails: GetAllSubscribersEmails) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const subscribersEmails = await this.getAllSubscribersEmails.execute();
      res.status(200).json({ subscribersEmails });
    } catch (error) {
      next(error);
    }
  }
}
