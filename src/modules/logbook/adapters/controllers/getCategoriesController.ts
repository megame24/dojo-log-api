import Adapter from "../../../shared/adapters/adapter";
import { GetCategories } from "../../useCases/getCategories";

export default class GetCategoriesController extends Adapter {
  constructor(private getCategories: GetCategories) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const categories = await this.getCategories.execute();

      const categoriesResponseDTO = categories.map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color,
      }));

      res.status(200).json(categoriesResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
