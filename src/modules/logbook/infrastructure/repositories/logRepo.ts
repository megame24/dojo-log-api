import AppError from "../../../shared/AppError";
import Log from "../../entities/log";

export interface LogRepo {
  create: (log: Log) => void;
}

export class LogRepoImpl implements LogRepo {
  constructor(private LogModel: any) {}

  async create(log: Log) {
    try {
      const logProps = {
        id: log.id,
        userId: log.userId,
        logbookId: log.logbookId,
        visibility: log.visibility,
        date: log.date,
        message: log.message,
        durationOfWork: log.durationOfWork,
        proofOfWorkImageUrl: log.proofOfWorkImageUrl,
      };
      await this.LogModel.create(logProps);
    } catch (error: any) {
      throw AppError.internalServerError("Error creating Log", error);
    }
  }
}
