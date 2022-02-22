import UseCase from "../../shared/useCases/useCase";
import Category from "../entities/category";
import { CategoryRepo } from "../infrastructure/repositories/categoryRepo";

interface DeleteCategoryDTO {
  category: Category;
}

export interface DeleteCategory extends UseCase<DeleteCategoryDTO, void> {
  execute: (deleteCategoryDTO: DeleteCategoryDTO) => void;
}

export class DeleteCategoryImpl implements DeleteCategory {
  constructor(private categoryRepo: CategoryRepo) {}

  async execute(deleteCategoryDTO: DeleteCategoryDTO) {
    const { category } = deleteCategoryDTO;

    await this.categoryRepo.delete(category);
  }
}
