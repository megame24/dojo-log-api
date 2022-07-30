import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import Category from "../../entities/category";

export interface CategoryRepo {
  create: (category: Category) => void;
  getCategoryByName: (name: string) => Promise<Category | null>;
  getCategoryById: (id: string) => Promise<Category | null>;
  delete: (category: Category) => void;
  getAll: () => Promise<Category[]>;
}

export class CategoryRepoImpl implements CategoryRepo {
  constructor(private CategoryModel: any, private uuidService: UUIDService) {}

  async create(category: Category) {
    try {
      const categoryProps = {
        id: category.id,
        name: category.name,
        color: category.color,
      };
      await this.CategoryModel.create(categoryProps);
    } catch (error: any) {
      throw AppError.internalServerError("Error creating Category", error);
    }
  }

  private async getCategory(queryOption: any): Promise<Category | null> {
    let categoryData: any;

    try {
      categoryData = await this.CategoryModel.findOne(queryOption);
    } catch (error: any) {
      throw AppError.internalServerError("Error retrieving Category", error);
    }

    if (!categoryData) return null;

    const categoryProps = {
      id: categoryData.id,
      name: categoryData.name,
      color: categoryData.color,
    };

    return Category.create(categoryProps, this.uuidService);
  }

  async getCategoryByName(name = ""): Promise<Category | null> {
    name = name.toLowerCase();
    const queryOption = { where: { name } };

    return this.getCategory(queryOption);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    if (!id) throw AppError.badRequestError("Category ID is required");

    const queryOption = { where: { id } };

    return this.getCategory(queryOption);
  }

  async delete(category: Category) {
    try {
      await this.CategoryModel.destroy({ where: { id: category.id } });
    } catch (error: any) {
      throw AppError.internalServerError("Error deleting Category", error);
    }
  }

  async getAll(): Promise<Category[]> {
    try {
      const categoriesData: any[] = await this.CategoryModel.findAll();

      const categories = categoriesData.map((categoryData) => {
        const categoryProps = {
          id: categoryData.id,
          name: categoryData.name,
          color: categoryData.color,
        };

        return Category.create(categoryProps, this.uuidService);
      });

      return categories;
    } catch (error: any) {
      throw AppError.internalServerError("Error retrieving Categories", error);
    }
  }
}
