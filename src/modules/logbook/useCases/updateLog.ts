import AppError from "../../shared/AppError";
import { DateService } from "../../shared/infrastructure/services/dateService";
import { FileService } from "../../shared/infrastructure/services/fileService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import { User } from "../../users/api";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";

export interface UpdateLogDTO {
  log: Log;
  message?: string;
  durationOfWork?: string;
  file?: any;
  user: User;
}

export interface UpdateLog extends UseCase<UpdateLogDTO, void> {
  execute: (updateLogDTO: UpdateLogDTO) => void;
}

export class UpdateLogImpl implements UpdateLog {
  constructor(
    private logRepo: LogRepo,
    private uuidService: UUIDService,
    private fileService: FileService,
    private dateService: DateService
  ) {}

  async execute(updateLogDTO: UpdateLogDTO) {
    const {
      log: outdatedLog,
      file,
      message,
      durationOfWork,
      user,
    } = updateLogDTO;

    const outdatedLogDateInUTC = this.dateService.getDateInUTC(
      outdatedLog.date
    );
    const todayDateInUTC = this.dateService.getDateInUTC(new Date());

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

    await this.logRepo.update(log, user);
  }
}
