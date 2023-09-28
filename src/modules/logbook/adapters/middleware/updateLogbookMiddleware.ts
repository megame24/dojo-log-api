import Adapter from "../../../shared/adapters/adapter";
import { UpdateLogbook } from "../../useCases/updateLogbook";

export default class UpdateLogbookMiddleware extends Adapter {
  constructor(private updateLogbook: UpdateLogbook) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const updateLogbookDTO = {
      user: req.user,
      logbook: req.logbook,
    };

    try {
      this.updateLogbook.execute(updateLogbookDTO);
    } catch (error) {
      next(error);
    }
  }
}
