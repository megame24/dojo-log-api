import Adapter from "../../../shared/adapters/adapter";
import { DeleteAccount } from "../../useCases/deleteAccount";

export default class DeleteAccountController extends Adapter {
  constructor(private deleteAccount: DeleteAccount) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const deleteAccountDTO = {
      user: req.user,
    };

    try {
      await this.deleteAccount.execute(deleteAccountDTO);

      res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
