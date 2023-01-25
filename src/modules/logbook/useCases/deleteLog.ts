import AppError from "../../shared/AppError";
import { DateService } from "../../shared/infrastructure/services/dateService";
import UseCase from "../../shared/useCases/useCase";
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

    const logDateInUTC = this.dateService.getDateInUTC(log.date);
    const todayDateInUTC = this.dateService.getDateInUTC(new Date());

    if (todayDateInUTC !== logDateInUTC)
      throw AppError.badRequestError("Can't delete previous days' logs");

    if (log.proofOfWork) {
      await this.deleteFile.execute({ file: log.proofOfWork });
    }

    await this.logRepo.delete(log);
  }
}
