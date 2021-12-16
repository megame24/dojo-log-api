import AppError from "../../shared/AppError";
import { FileService } from "../../shared/infrastructure/services/fileService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";

// THIS IS BUGGY, NEED TO RETHINK AUTHORIZATION!!!!

interface UpdateLogDTO {
  logId: string;
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
    const { logId, file, message, durationOfWork } = updateLogDTO;

    const outdatedLog = await this.logRepo.getLogById(logId);
    if (!outdatedLog) throw AppError.notFoundError("Log not found");

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
      visibility: outdatedLog.visibility, // I NEED TO RETHINK VISIBILITY FOR LOGBOOK CHILDREN, BECAUSE UPDATING THE LOGBOOK'S VISIBILITY SHOULD CASCADE... Ans: Just remove visibility from children!!!
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
