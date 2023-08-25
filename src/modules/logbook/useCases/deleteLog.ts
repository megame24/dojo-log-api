import AppError from "../../shared/AppError";
import { DateService } from "../../shared/infrastructure/services/dateService";
import UseCase from "../../shared/useCases/useCase";
import { Visibility } from "../entities/logbook";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";
import { DeleteFile } from "./deleteFile";

interface DeleteLogDTO {
  log: Log;
}

export interface DeleteLog extends UseCase<DeleteLogDTO, void> {
  execute: (deleteLogDTO: DeleteLogDTO) => void;
}

export class DeleteLogImpl implements DeleteLog {
  constructor(
    private logRepo: LogRepo,
    private deleteFile: DeleteFile,
    private dateService: DateService
  ) {}

  async execute(deleteLogDTO: DeleteLogDTO) {
    const { log } = deleteLogDTO;

    // NOTE: we want to do time check in client's timezone when deleting log
    const logDateTimestamp = this.dateService.getTimelessTimestamp(
      log.date,
      true
    );
    const todayDateInTimestamp = this.dateService.getTimelessTimestamp(
      new Date(),
      true
    );

    if (todayDateInTimestamp !== logDateTimestamp)
      throw AppError.badRequestError("Can't delete previous days' logs");

    if (log.proofOfWork) {
      await this.deleteFile.execute({
        userId: log.userId,
        file: log.proofOfWork,
      });
    }

    await this.logRepo.delete(log);
  }
}
