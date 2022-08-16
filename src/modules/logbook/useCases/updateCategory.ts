import AppError from "../../shared/AppError";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Category from "../entities/category";
import { CategoryRepo } from "../infrastructure/repositories/categoryRepo";

interface UpdateCategoryDTO {
  name: string;
  color: string;
  iconName: string;
  category: Category;
}

export interface UpdateCategory
  extends UseCase<UpdateCategoryDTO, Promise<Category>> {
  execute: (updateCategoryDTO: UpdateCategoryDTO) => Promise<Category>;
}

export class UpdateCategoryImpl implements UpdateCategory {
  constructor(
    private categoryRepo: CategoryRepo,
    private uuidService: UUIDService
  ) {}

  async execute(updateCategoryDTO: UpdateCategoryDTO): Promise<Category> {
    const {
      name,
      color,
      iconName,
      category: outdatedCategory,
    } = updateCategoryDTO;

    const categoryWithSameName = await this.categoryRepo.getCategoryByName(
      name
    );
    if (
      categoryWithSameName &&
      outdatedCategory.id !== categoryWithSameName.id
    ) {
      throw AppError.badRequestError("Category with that name already exists");
    }

    const category = Category.create(
      { id: outdatedCategory.id, name, color, iconName },
      this.uuidService
    );
    await this.categoryRepo.update(category);
    return category;
  }
}
