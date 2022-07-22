import Adapter from "../../../shared/adapters/adapter";
import { CreateCategory } from "../../useCases/createCategory";

export default class CreateCategoryController extends Adapter {
  constructor(private createCategory: CreateCategory) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { name, color } = req.body;

    try {
      const category = await this.createCategory.execute({ name, color });
      res.status(201).json({ categoryId: category.id });
    } catch (error) {
      next(error);
    }
  }
}
