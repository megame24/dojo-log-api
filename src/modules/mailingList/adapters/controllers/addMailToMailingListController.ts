import Adapter from "../../../shared/adapters/adapter";
import { AddMailToMailingList } from "../../useCases/addMailToMailingList";

export default class AddMailToMailingListController extends Adapter {
  constructor(private addMailToMailingList: AddMailToMailingList) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { email } = req.body;
    const addMailToMailingListDTO = { email };

    try {
      await this.addMailToMailingList.execute(addMailToMailingListDTO);
      res
        .status(200)
        .json({ message: "Mail added to mailing list successfully" });

      next();
    } catch (error) {
      next(error);
    }
  }
}
