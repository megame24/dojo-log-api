import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import Category from "../../entities/category";
import Logbook from "../../entities/logbook";
import { DateService } from "../services/dateService";

export interface LogbookRepo {
  create: (logbook: Logbook) => void;
  getLiteLogbookById: (logbookId: string) => Promise<Logbook | null>;
}

export class LogbookRepoImpl implements LogbookRepo {
  constructor(
    private LogbookModel: any,
    private CategoryModel: any,
    private uuidService: UUIDService,
    private dateService: DateService
  ) {}

  async create(logbook: Logbook) {
    try {
      const logbookProps = {
        id: logbook.id,
        name: logbook.name,
        userId: logbook.userId,
        description: logbook.description,
        visibility: logbook.visibility,
        categoryId: logbook.category.id,
      };
      await this.LogbookModel.create(logbookProps);
    } catch (error: any) {
      throw AppError.internalServerError("Error creating Logbook", error);
    }
  }

  async getLiteLogbookById(logbookId: string): Promise<Logbook | null> {
    if (!logbookId) throw AppError.badRequestError("logbookId is required");

    let logbookData: any;
    try {
      logbookData = await this.LogbookModel.findOne({
        where: { id: logbookId },
        include: { model: this.CategoryModel, required: true },
      });
    } catch (error: any) {
      throw AppError.internalServerError("Error getting Logbook", error);
    }

    if (!logbookData) return null;

    const categoryData = logbookData.Category;
    const category = Category.create(
      { id: categoryData.id, name: categoryData.name },
      this.uuidService
    );

    const createLogbookProps = {
      id: logbookData.id,
      userId: logbookData.userId,
      name: logbookData.name,
      describe: logbookData.description,
      visibility: logbookData.visibility,
      category,
    };
    const logbook = Logbook.create(
      createLogbookProps,
      this.uuidService,
      this.dateService
    );
    return logbook;
  }
}
