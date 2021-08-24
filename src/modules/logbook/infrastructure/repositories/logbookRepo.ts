import AppError from "../../../shared/AppError";
import Logbook from "../../entities/logbook";

export interface LogbookRepo {
  create: (logbook: Logbook) => void;
}

export class LogbookRepoImpl implements LogbookRepo {
  constructor(private LogbookModel: any) {}

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
    } catch (error) {
      throw AppError.internalServerError("Error creating Logbook", error);
    }
  }
}
