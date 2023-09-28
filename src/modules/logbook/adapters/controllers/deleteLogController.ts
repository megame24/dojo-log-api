import Adapter from "../../../shared/adapters/adapter";
import { DeleteLog } from "../../useCases/deleteLog";
import { GetLiteLogbook } from "../../useCases/getLiteLogbook";

export default class DeleteLogController extends Adapter {
  constructor(
    private deleteLog: DeleteLog,
    private getLiteLogbook: GetLiteLogbook
  ) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const deleteLogDTO = {
      log: req.log,
    };

    try {
      await this.deleteLog.execute(deleteLogDTO);
      res.status(200).json({ message: "Log deleted successfully" });
      const logbook = await this.getLiteLogbook.execute({
        logbookId: req.params.logbookId,
      });
      req.logbook = logbook;
      next();
    } catch (error) {
      next(error);
    }
  }
}
