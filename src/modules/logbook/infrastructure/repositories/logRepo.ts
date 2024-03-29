import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import User from "../../../users/entities/user";
import File from "../../entities/file";
import Log from "../../entities/log";

export interface LogRepo {
  create: (log: Log, createdBy: User) => void;
  getLogsByLogbookIdStartAndEndDates: (
    logbookId: string,
    startDate: Date,
    endDate: Date,
    includeProofOfWork?: boolean
  ) => Promise<Log[]>;
  update: (log: Log, updatedBy: User) => void;
  getLogById: (logId: string) => Promise<Log | null>;
  delete: (log: Log) => void;
}

export class LogRepoImpl implements LogRepo {
  constructor(
    private LogModel: any,
    private FileModel: any,
    private LogbookModel: any,
    private uuidService: UUIDService,
    private Op: any
  ) {}

  async create(log: Log, createdBy: User) {
    try {
      const createLogProps = {
        id: log.id,
        userId: log.userId,
        logbookId: log.logbookId,
        date: log.date,
        message: log.message,
        durationOfWorkInMinutes: log.durationOfWorkInMinutes,
        createdBy: createdBy.id,
      };
      await this.LogModel.create(createLogProps);
    } catch (error: any) {
      throw AppError.internalServerError("Error creating Log", error);
    }
  }

  async update(log: Log, updatedBy: User) {
    try {
      const updateLogProps = {
        id: log.id,
        userId: log.userId,
        logbookId: log.logbookId,
        date: log.date,
        message: log.message,
        durationOfWorkInMinutes: log.durationOfWorkInMinutes,
        updatedBy: updatedBy.id,
      };
      await this.LogModel.update(updateLogProps, { where: { id: log.id } });
    } catch (error: any) {
      throw AppError.internalServerError("Error updating Log", error);
    }
  }

  async delete(log: Log) {
    try {
      await this.LogModel.destroy({ where: { id: log.id } });
    } catch (error: any) {
      throw AppError.internalServerError("Error deleting Log", error);
    }
  }

  private async getLogs(queryOption: any, logbookData: any): Promise<Log[]> {
    let logsData: any[];

    try {
      logsData = await this.LogModel.findAll(queryOption);
    } catch (error: any) {
      throw AppError.internalServerError("Error retrieving Logs", error);
    }

    if (!logsData.length) return [];

    const logs: Log[] = logsData.map((logData: any) => {
      const fileData = logData?.Files ? logData?.Files[0] : undefined;

      let proofOfWork;
      if (fileData) {
        const createFileProps = {
          id: fileData.id,
          userId: fileData.userId,
          rewardId: fileData.rewardId,
          type: fileData.type,
          url: fileData.url,
          name: fileData.name,
          visibility: fileData.visibility,
        };

        proofOfWork = File.create(createFileProps, this.uuidService);
      }

      const createLogProps = {
        id: logData.id,
        userId: logData.userId,
        logbookId: logData.logbookId,
        visibility: logbookData.visibility,
        date: logData.date,
        message: logData.message,
        durationOfWorkInMinutes: logData.durationOfWorkInMinutes,
        proofOfWork,
      };

      return Log.create(createLogProps, this.uuidService);
    });

    return Promise.all(logs);
  }

  async getLogsByLogbookIdStartAndEndDates(
    logbookId: string,
    startDate: Date,
    endDate: Date,
    includeProofOfWork = false
  ): Promise<Log[]> {
    const queryOption: any = {
      where: {
        logbookId,
        date: {
          [this.Op.gte]: startDate,
          [this.Op.lte]: endDate,
        },
      },
    };

    if (includeProofOfWork) {
      queryOption.include = { model: this.FileModel, required: false };
    }

    const logbookData = await this.LogbookModel.findByPk(logbookId);
    if (!logbookData) throw AppError.notFoundError("Logbook not found");

    return this.getLogs(queryOption, logbookData);
  }

  private async getLog(queryOption: any): Promise<Log | null> {
    let logData: any;

    try {
      logData = await this.LogModel.findOne(queryOption);
    } catch (error: any) {
      throw AppError.internalServerError("Error retrieving Log", error);
    }

    if (!logData) return null;

    const fileData = logData?.Files ? logData?.Files[0] : undefined;

    let proofOfWork;
    if (fileData) {
      const createFileProps = {
        id: fileData.id,
        userId: fileData.userId,
        logId: fileData.logId,
        type: fileData.type,
        url: fileData.url,
        name: fileData.name,
        visibility: fileData.visibility,
      };

      proofOfWork = File.create(createFileProps, this.uuidService);
    }

    const createLogProps = {
      id: logData.id,
      userId: logData.userId,
      logbookId: logData.logbookId,
      visibility: logData.Logbook.visibility,
      date: logData.date,
      message: logData.message,
      durationOfWorkInMinutes: logData.durationOfWorkInMinutes,
      proofOfWork,
    };

    return Log.create(createLogProps, this.uuidService);
  }

  async getLogById(logId: string): Promise<Log | null> {
    const queryOption = {
      where: { id: logId },
      include: [
        { model: this.LogbookModel, required: true },
        { model: this.FileModel, required: false },
      ],
    };

    return this.getLog(queryOption);
  }
}
