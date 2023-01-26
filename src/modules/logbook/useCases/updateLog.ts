import AppError from "../../shared/AppError";
import { DateService } from "../../shared/infrastructure/services/dateService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import { User } from "../../users/api";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";
import { CreateFile } from "./createFile";
import { DeleteFile } from "./deleteFile";

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
    private createFile: CreateFile,
    private deleteFile: DeleteFile,
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

    const updateLogProps = {
      id: outdatedLog.id,
      userId: outdatedLog.userId,
      logbookId: outdatedLog.logbookId,
      visibility: outdatedLog.visibility,
      date: outdatedLog.date,
      message: outdatedLog.message,
      durationOfWork: outdatedLog.durationOfWork,
      proofOfWork: outdatedLog.proofOfWork,
      ...(message && { message }),
      ...(durationOfWork && { durationOfWork }),
    };

    let newProofOfWork;
    if (file) {
      if (outdatedLog.proofOfWork)
        await this.deleteFile.execute({ file: outdatedLog.proofOfWork });
      newProofOfWork = await this.createFile.execute({
        userId: outdatedLog.userId,
        logId: outdatedLog.id,
        rawFile: file,
      });
      updateLogProps.proofOfWork = newProofOfWork;
    }

    const log = Log.create(updateLogProps, this.uuidService);

    await this.logRepo.update(log, user);
  }
}
