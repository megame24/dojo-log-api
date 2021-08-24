import Adapter from "../../../shared/adapters/adapter";
import { CreateLogbook } from "../../useCases/createLogbook";

export default class CreateLogbookController extends Adapter {
  constructor(private createLogbook: CreateLogbook) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const createLogbookDTO = {
      name: req.body.name,
      description: req.body.description,
      visibility: req.body.visibility,
      categoryId: req.body.categoryId,
      userId: req.user.id,
    };

    try {
      await this.createLogbook.execute(createLogbookDTO);
      res.status(201).json({ message: "Logbook created successfully" });
    } catch (error) {
      next(error);
    }
  }
}
