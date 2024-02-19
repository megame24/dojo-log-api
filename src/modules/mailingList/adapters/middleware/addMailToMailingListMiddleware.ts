import Adapter from "../../../shared/adapters/adapter";
import { AddMailToMailingList } from "../../useCases/addMailToMailingList";

export default class AddMailToMailingListMiddleware extends Adapter {
  constructor(private addMailToMailingList: AddMailToMailingList) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { email } = req.user;
    const addMailToMailingListDTO = { email };

    try {
      this.addMailToMailingList.execute(addMailToMailingListDTO);
    } catch (error) {
      console.log(error);
    }
  }
}
