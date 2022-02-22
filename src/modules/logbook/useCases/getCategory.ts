import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import Category from "../entities/category";
import { CategoryRepo } from "../infrastructure/repositories/categoryRepo";

interface GetCategoryDTO {
  categoryId: string;
}

export interface GetCategory
  extends UseCase<GetCategoryDTO, Promise<Category>> {
  execute: (getCategoryDTO: GetCategoryDTO) => Promise<Category>;
}

export class GetCategoryImpl implements GetCategory {
  constructor(private categoryRepo: CategoryRepo) {}

  async execute(getCategoryDTO: GetCategoryDTO): Promise<Category> {
    const { categoryId } = getCategoryDTO;

    const category = await this.categoryRepo.getCategoryById(categoryId);

    if (!category) throw AppError.notFoundError("Category not found");

    return category;
  }
}
