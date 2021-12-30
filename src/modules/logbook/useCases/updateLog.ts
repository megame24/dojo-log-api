import AppError from "../../shared/AppError";
import { FileService } from "../../shared/infrastructure/services/fileService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";

export interface UpdateLogDTO {
  log: Log;
  message?: string;
  durationOfWork?: string;
  file?: any;
}

export interface UpdateLog extends UseCase<UpdateLogDTO, void> {
  execute: (updateLogDTO: UpdateLogDTO) => void;
}

export class UpdateLogImpl implements UpdateLog {
  constructor(
    private logRepo: LogRepo,
    private uuidService: UUIDService,
    private fileService: FileService
  ) {}

  async execute(updateLogDTO: UpdateLogDTO) {
    const { log: outdatedLog, file, message, durationOfWork } = updateLogDTO;

    const outdatedLogDateInUTC = Date.UTC(
      outdatedLog.date.getFullYear(),
      outdatedLog.date.getMonth(),
      outdatedLog.date.getDate()
    );
    const todayDate = new Date();
    const todayDateInUTC = Date.UTC(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate()
    );
    if (outdatedLogDateInUTC !== todayDateInUTC)
      throw AppError.badRequestError("Can't update previous days' logs");

    let proofOfWorkImageUrl;
    if (file) {
      if (outdatedLog.proofOfWorkImageUrl)
        await this.fileService.deleteFile(outdatedLog.proofOfWorkImageUrl);
      proofOfWorkImageUrl = await this.fileService.uploadFile(file);
    }

    const updateLogProps = {
      id: outdatedLog.id,
      userId: outdatedLog.userId,
      logbookId: outdatedLog.logbookId,
      visibility: outdatedLog.visibility,
      date: outdatedLog.date,
      message: outdatedLog.message,
      durationOfWork: outdatedLog.durationOfWork,
      proofOfWorkImageUrl: outdatedLog.proofOfWorkImageUrl,
      ...(proofOfWorkImageUrl && { proofOfWorkImageUrl }),
      ...(message && { message }),
      ...(durationOfWork && { durationOfWork }),
    };

    const log = Log.create(updateLogProps, this.uuidService);

    await this.logRepo.update(log);
  }
}
