import Adapter from "../../../shared/adapters/adapter";
import { UpdateLogbook } from "../../useCases/updateLogbook";

export default class UpdateLogbookController extends Adapter {
  constructor(private updateLogbook: UpdateLogbook) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { name, description, visibility, categoryId } = req.body;

    const updateLogbookDTO = {
      name,
      description,
      visibility,
      categoryId,
      user: req.user,
      logbook: req.logbook,
    };

    try {
      await this.updateLogbook.execute(updateLogbookDTO);
      res.status(200).json({ message: "Logbook updated successfully " });
    } catch (error) {
      next(error);
    }
  }
}
