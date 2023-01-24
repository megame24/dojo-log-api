import AppError from "../../shared/AppError";
import { DateService } from "../../shared/infrastructure/services/dateService";
import { FileService } from "../../shared/infrastructure/services/fileService";
import UseCase from "../../shared/useCases/useCase";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";

interface DeleteLogDTO {
  log: Log;
}

export interface DeleteLog extends UseCase<DeleteLogDTO, void> {
  execute: (deleteLogDTO: DeleteLogDTO) => void;
}

export class DeleteLogImpl implements DeleteLog {
  constructor(
    private logRepo: LogRepo,
    private fileService: FileService,
    private dateService: DateService
  ) {}

  async execute(deleteLogDTO: DeleteLogDTO) {
    const { log } = deleteLogDTO;

    const logDateInUTC = this.dateService.getDateInUTC(log.date);
    const todayDateInUTC = this.dateService.getDateInUTC(new Date());

    if (todayDateInUTC !== logDateInUTC)
      throw AppError.badRequestError("Can't delete previous days' logs");

    // if (log.proofOfWorkImageUrl) {
    //   await this.fileService.deleteFile(log.proofOfWorkImageUrl);
    // } rework

    await this.logRepo.delete(log);
  }
}
