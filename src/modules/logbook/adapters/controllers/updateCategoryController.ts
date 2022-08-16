import Adapter from "../../../shared/adapters/adapter";
import { UpdateCategory } from "../../useCases/updateCategory";

export default class UpdateCategoryController extends Adapter {
  constructor(private updateCategory: UpdateCategory) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { name, color, iconName } = req.body;

    const updateCategoryDTO = {
      name,
      color,
      iconName,
      category: req.category,
    };

    try {
      await this.updateCategory.execute(updateCategoryDTO);
      res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}
