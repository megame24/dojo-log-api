import Adapter from "../../../shared/adapters/adapter";
import { DeleteCategory } from "../../useCases/deleteCategory";

export default class DeleteCategoryController extends Adapter {
  constructor(private deleteCategory: DeleteCategory) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const deleteCategoryDTO = {
      category: req.category,
    };

    try {
      await this.deleteCategory.execute(deleteCategoryDTO);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
