import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";
import Logbook from "../entities/logbook";
import { User } from "../../users/api";
import { CreateFile } from "./createFile";

interface CreateLogDTO {
  userId: string;
  logbook: Logbook;
  message: string;
  durationOfWorkInMinutes: number;
  date: Date;
  file?: any;
  user: User;
}

export interface CreateLog extends UseCase<CreateLogDTO, Promise<Log>> {
  execute: (createLogDTO: CreateLogDTO) => Promise<Log>;
}

export class CreateLogImpl implements CreateLog {
  constructor(
    private logRepo: LogRepo,
    private createFile: CreateFile,
    private uuidService: UUIDService
  ) {}

  async execute(createLogDTO: CreateLogDTO): Promise<Log> {
    const { userId, file } = createLogDTO;

    const createLogProps = {
      userId,
      logbookId: <string>createLogDTO.logbook.id,
      visibility: createLogDTO.logbook.visibility,
      date: createLogDTO.date,
      message: createLogDTO.message,
      durationOfWorkInMinutes: createLogDTO.durationOfWorkInMinutes,
    };
    const log = Log.create(createLogProps, this.uuidService);

    await this.logRepo.create(log, createLogDTO.user);

    if (file) {
      await this.createFile.execute({
        userId,
        logId: log.id,
        rawFile: file,
      });
    }
    // consider some form of transaction
    return log;
  }
}
