import Adapter from "../../../shared/adapters/adapter";
import { DeleteLogbook } from "../../useCases/deleteLogbook";

export default class DeleteLogbookController extends Adapter {
  constructor(private deleteLogbook: DeleteLogbook) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const deleteLogbookDTO = {
      logbook: req.logbook,
    };

    try {
      await this.deleteLogbook.execute(deleteLogbookDTO);
      res.status(200).json({ message: "Logbook deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
