import Adapter from "../../../shared/adapters/adapter";
import { UpdateLog } from "../../useCases/updateLog";

export default class UpdateLogController extends Adapter {
  constructor(private updateLog: UpdateLog) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const updateLogDTO = {
      logId: req.params.logId,
      message: req.body.message,
      durationOfWork: req.body.durationOfWork,
      ...(req.files && { file: req.files[0] }),
    };

    try {
      await this.updateLog.execute(updateLogDTO);
      res.status(200).json({ message: "Log updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}
