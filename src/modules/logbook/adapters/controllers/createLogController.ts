import Adapter from "../../../shared/adapters/adapter";
import { CreateLog } from "../../useCases/createLog";

export default class CreateLogController extends Adapter {
  constructor(private createLog: CreateLog) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const createLogDTO = {
      userId: req.user.id,
      logbook: req.resourceOrParent,
      message: req.body.message,
      durationOfWork: req.body.durationOfWork,
      ...(req.files && { file: req.files[0] }),
    };

    try {
      await this.createLog.execute(createLogDTO);
      res.status(201).json({ message: "Log created successfully" });
    } catch (error) {
      next(error);
    }
  }
}
