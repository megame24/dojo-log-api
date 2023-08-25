import AppError from "../../shared/AppError";
import { DateService } from "../../shared/infrastructure/services/dateService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import { User } from "../../users/api";
import { Visibility } from "../entities/logbook";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";
import { CreateFile } from "./createFile";
import { DeleteFile } from "./deleteFile";

export interface UpdateLogDTO {
  log: Log;
  message?: string;
  durationOfWorkInMinutes?: number;
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
    private createFile: CreateFile,
    private deleteFile: DeleteFile,
    private dateService: DateService
  ) {}

  async execute(updateLogDTO: UpdateLogDTO) {
    const {
      log: outdatedLog,
      file,
      message,
      durationOfWorkInMinutes,
      user,
    } = updateLogDTO;

    // NOTE: we want to do time check in client's timezone when deleting log
    const outdatedLogDateInUTC = this.dateService.getTimelessTimestamp(
      outdatedLog.date,
      true
    );
    const todayDateInUTC = this.dateService.getTimelessTimestamp(
      new Date(),
      true
    );

    if (outdatedLogDateInUTC !== todayDateInUTC)
      throw AppError.badRequestError("Can't update previous days' logs");

    const updateLogProps = {
      id: outdatedLog.id,
      userId: outdatedLog.userId,
      logbookId: outdatedLog.logbookId,
      visibility: outdatedLog.visibility,
      date: outdatedLog.date,
      message: outdatedLog.message,
      durationOfWorkInMinutes: outdatedLog.durationOfWorkInMinutes,
      proofOfWork: outdatedLog.proofOfWork,
      ...(message && { message }),
      ...(durationOfWorkInMinutes && { durationOfWorkInMinutes }),
    };

    let newProofOfWork;
    if (file) {
      if (outdatedLog.proofOfWork)
        await this.deleteFile.execute({
          userId: outdatedLog.userId,
          file: outdatedLog.proofOfWork,
        });
      newProofOfWork = await this.createFile.execute({
        userId: outdatedLog.userId,
        logId: outdatedLog.id,
        rawFile: file,
        visibility: Visibility.private,
      });
      updateLogProps.proofOfWork = newProofOfWork;
    }

    const log = Log.create(updateLogProps, this.uuidService);

    await this.logRepo.update(log, user);
  }
}
