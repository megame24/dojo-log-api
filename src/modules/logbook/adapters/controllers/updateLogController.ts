import Adapter from "../../../shared/adapters/adapter";
import { GetLiteLogbook } from "../../useCases/getLiteLogbook";
import { UpdateLog } from "../../useCases/updateLog";

export default class UpdateLogController extends Adapter {
  constructor(
    private updateLog: UpdateLog,
    private getLiteLogbook: GetLiteLogbook
  ) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const updateLogDTO = {
      log: req.log,
      message: req.body.message,
      durationOfWorkInMinutes: req.body.durationOfWorkInMinutes,
      file: null,
      user: req.user,
    };

    if (req.files) {
      updateLogDTO.file = req.files[0];
    }

    try {
      await this.updateLog.execute(updateLogDTO);
      res.status(200).json({ message: "Log updated successfully" });
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
