import AppError from "../../shared/AppError";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Category from "../entities/category";
import { CategoryRepo } from "../infrastructure/repositories/categoryRepo";

interface CreateCategoryDTO {
  name: string;
}

export interface CreateCategory
  extends UseCase<CreateCategoryDTO, Promise<Category>> {
  execute: (createCategoryDTO: CreateCategoryDTO) => Promise<Category>;
}

export class CreateCategoryImpl implements CreateCategory {
  constructor(
    private categoryRepo: CategoryRepo,
    private uuidService: UUIDService
  ) {}

  async execute(createCategoryDTO: CreateCategoryDTO): Promise<Category> {
    const { name } = createCategoryDTO;

    const categoryWithSameName = await this.categoryRepo.getCategoryByName(
      name
    );
    if (categoryWithSameName) {
      throw AppError.badRequestError("Category with that name already exists");
    }

    const category = Category.create({ name }, this.uuidService);
    await this.categoryRepo.create(category);
    return category;
  }
}
