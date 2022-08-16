import AppError from "../../../shared/AppError";
import { DateService } from "../../../shared/infrastructure/services/dateService";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import { User } from "../../../users/api";
import Category from "../../entities/category";
import Goal from "../../entities/goal";
import Log from "../../entities/log";
import Logbook, { Visibility } from "../../entities/logbook";
import { GoalRepo } from "./goalRepo";
import { LogRepo } from "./logRepo";

interface GetLogbookByIdQueryOption {
  startDate: Date;
  endDate: Date;
}

interface GetLogbooksByUserIdQueryOption {
  includePrivateLogbooks: boolean;
}

export interface LogbookRepo {
  create: (logbook: Logbook) => void;
  update: (logbook: Logbook, updatedBy: User) => void;
  getLiteLogbookById: (logbookId: string) => Promise<Logbook | null>;
  getLogbookById: (
    logbookId: string,
    getLogbookByIdQueryOption: GetLogbookByIdQueryOption
  ) => Promise<Logbook | null>;
  getLogbooksByUserId: (
    userId: string,
    getLogbooksByUserIdQueryOption: GetLogbooksByUserIdQueryOption
  ) => Promise<Logbook[]>;
  delete: (logbook: Logbook) => void;
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
        categoryId: logbook.category?.id,
      };
      await this.LogbookModel.create(logbookProps);
    } catch (error: any) {
      throw AppError.internalServerError("Error creating Logbook", error);
    }
  }

  async update(logbook: Logbook, updatedBy: User) {
    try {
      const updateLogbookProps = {
        id: logbook.id,
        name: logbook.name,
        userId: logbook.userId,
        description: logbook.description,
        visibility: logbook.visibility,
        categoryId: logbook.category?.id,
        updatedBy: updatedBy.id,
      };
      await this.LogbookModel.update(updateLogbookProps, {
        where: { id: logbook.id },
      });
    } catch (error: any) {
      throw AppError.internalServerError("Error updating Logbook", error);
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
        include: [
          { model: this.CategoryModel, required: false },
          ...(queryOption?.include ? queryOption.include : []),
        ],
        ...queryOption,
      });
    } catch (error: any) {
      throw AppError.internalServerError("Error getting Logbook", error);
    }

    if (!logbookData) return null;

    const categoryData = logbookData.Category;
    let category;
    if (categoryData) {
      category = Category.create(
        {
          id: categoryData.id,
          name: categoryData.name,
          color: categoryData.color,
          iconName: categoryData.iconName,
        },
        this.uuidService
      );
    }

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
    getLogbookByIdQueryOption: GetLogbookByIdQueryOption
  ): Promise<Logbook | null> {
    if (!logbookId) throw AppError.badRequestError("logbookId is required");
    const { startDate, endDate } = getLogbookByIdQueryOption;

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

  private async getLogbooks(queryOption: any): Promise<Logbook[]> {
    try {
      const logbooksData: any[] = await this.LogbookModel.findAll(queryOption);

      const logbooks = logbooksData.map((logbookData) => {
        const categoryData = logbookData.Category;
        let category;
        if (categoryData) {
          category = Category.create(
            {
              id: categoryData.id,
              name: categoryData.name,
              color: categoryData.color,
              iconName: categoryData.iconName,
            },
            this.uuidService
          );
        }

        return Logbook.create(
          {
            id: logbookData.id,
            userId: logbookData.userId,
            name: logbookData.name,
            description: logbookData.description,
            visibility: logbookData.visibility,
            category,
          },
          this.uuidService,
          this.dateService
        );
      });

      return logbooks;
    } catch (error: any) {
      throw AppError.internalServerError("Error retrieving Logbooks", error);
    }
  }

  async getLogbooksByUserId(
    userId: string,
    getLogbooksByUserIdQueryOption: GetLogbooksByUserIdQueryOption
  ): Promise<Logbook[]> {
    if (!userId) throw AppError.badRequestError("userId is required");

    const { includePrivateLogbooks } = getLogbooksByUserIdQueryOption;

    const queryOption: any = {
      where: { userId, visibility: Visibility.public },
      include: { model: this.CategoryModel, required: false },
    };
    if (includePrivateLogbooks) {
      delete queryOption.where.visibility;
    }

    return this.getLogbooks(queryOption);
  }

  async delete(logbook: Logbook) {
    try {
      await this.LogbookModel.destroy({ where: { id: logbook.id } });
    } catch (error: any) {
      throw AppError.internalServerError("Error deleting Logbook", error);
    }
  }
}
