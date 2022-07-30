import UseCase from "../../shared/useCases/useCase";
import Category from "../entities/category";
import { CategoryRepo } from "../infrastructure/repositories/categoryRepo";

export interface GetCategories extends UseCase<void, Promise<Category[]>> {
  execute: () => Promise<Category[]>;
}

export class GetCategoriesImpl implements GetCategories {
  constructor(private categoryRepo: CategoryRepo) {}

  async execute(): Promise<Category[]> {
    const categories = await this.categoryRepo.getAll();

    return categories;
  }
}
