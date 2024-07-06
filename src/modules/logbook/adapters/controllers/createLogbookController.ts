import Adapter from "../../../shared/adapters/adapter";
import { CreateLogbook } from "../../useCases/createLogbook";

export default class CreateLogbookController extends Adapter {
  constructor(private createLogbook: CreateLogbook) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { name, description, visibility, categoryId, enableReminder } =
      req.body;

    const createLogbookDTO = {
      name,
      description,
      visibility,
      categoryId,
      userId: req.user.id, // this might be gotten from a diff param in the future
      enableReminder,
      user: req.user,
    };

    try {
      const logbook = await this.createLogbook.execute(createLogbookDTO);
      res.status(201).json({ logbookId: logbook.id });
    } catch (error) {
      next(error);
    }
  }
}
