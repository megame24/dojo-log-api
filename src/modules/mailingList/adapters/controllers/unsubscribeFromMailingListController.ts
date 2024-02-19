import Adapter from "../../../shared/adapters/adapter";
import { UnsubscribeFromMailingList } from "../../useCases/unsubscribeFromMailingList";

export default class UnsubscribeFromMailingListController extends Adapter {
  constructor(private unsubscribeFromMailingList: UnsubscribeFromMailingList) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { email } = req.body;
    console.log(email);
    const UnsubscribeFromMailingListDTO = { email };

    try {
      await this.unsubscribeFromMailingList.execute(
        UnsubscribeFromMailingListDTO
      );
      res
        .status(200)
        .json({ message: "Mail unsubscribed from mailing list successfully" });
    } catch (error) {
      next(error);
    }
  }
}
