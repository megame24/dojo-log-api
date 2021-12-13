import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import Category from "../../entities/category";
import Goal from "../../entities/goal";
import Log from "../../entities/log";
import Logbook from "../../entities/logbook";
import { DateService } from "../services/dateService";
import { GoalRepo } from "./goalRepo";
import { LogRepo } from "./logRepo";

interface GetByIdQueryOption {
  startDate: Date;
  endDate: Date;
}

export interface LogbookRepo {
  create: (logbook: Logbook) => void;
  getLiteLogbookById: (logbookId: string) => Promise<Logbook | null>;
  getLogbookById: (
    logbookId: string,
    getByIdQueryOption: GetByIdQueryOption
  ) => Promise<Logbook | null>;
}

export class LogbookRepoImpl implements LogbookRepo {
  constructor(
    private LogbookModel: any,
    private CategoryModel: any,
    private uuidService: UUIDService,
    private dateService: DateService,
    private goalRepo: GoalRepo,
    private logRepo: LogRepo
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

  private async getLogbook(
    queryOption: any,
    goals: Goal[] = [],
    logs: Log[] = []
  ): Promise<Logbook | null> {
    let logbookData: any;
    try {
      logbookData = await this.LogbookModel.findOne({
        include: { model: this.CategoryModel, required: true },
        ...queryOption,
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
      description: logbookData.description,
      visibility: logbookData.visibility,
      category,
      logs,
      goals,
    };
    const logbook = Logbook.create(
      createLogbookProps,
      this.uuidService,
      this.dateService
    );
    return logbook;
  }

  async getLiteLogbookById(logbookId: string): Promise<Logbook | null> {
    if (!logbookId) throw AppError.badRequestError("logbookId is required");

    const queryOption = { where: { id: logbookId } };

    return this.getLogbook(queryOption);
  }

  async getLogbookById(
    logbookId: string,
    getByIdQueryOption: GetByIdQueryOption
  ): Promise<Logbook | null> {
    if (!logbookId) throw AppError.badRequestError("logbookId is required");
    const { startDate, endDate } = getByIdQueryOption;

    const goals = await this.goalRepo.getGoalsByLogbookIdStartAndEndDates(
      logbookId,
      startDate,
      endDate
    );
    const logs = await this.logRepo.getLogsByLogbookIdStartAndEndDates(
      logbookId,
      startDate,
      endDate
    );

    const queryOption = { where: { id: logbookId } };

    return this.getLogbook(queryOption, goals, logs);
  }
}
