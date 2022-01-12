import Adapter from "../../../shared/adapters/adapter";
import { DeleteLog } from "../../useCases/deleteLog";

export default class DeleteLogController extends Adapter {
  constructor(private deleteLog: DeleteLog) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const deleteLogDTO = {
      log: req.log,
    };

    try {
      await this.deleteLog.execute(deleteLogDTO);
      res.status(200).json({ message: "Log deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
