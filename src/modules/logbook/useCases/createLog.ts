import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";
import Logbook from "../entities/logbook";
import { FileService } from "../../shared/infrastructure/services/fileService";
import { User } from "../../users/api";

interface CreateLogDTO {
  userId: string;
  logbook: Logbook;
  message: string;
  durationOfWork?: string;
  file?: any;
  user: User;
}

export interface CreateLog extends UseCase<CreateLogDTO, Promise<Log>> {
  execute: (createLogDTO: CreateLogDTO) => Promise<Log>;
}

export class CreateLogImpl implements CreateLog {
  constructor(
    private logRepo: LogRepo,
    private uuidService: UUIDService,
    private fileService: FileService
  ) {}

  async execute(createLogDTO: CreateLogDTO): Promise<Log> {
    let proofOfWorkImageUrl;
    if (createLogDTO.file) {
      proofOfWorkImageUrl = await this.fileService.uploadFile(
        createLogDTO.file
      );
    }

    const createLogProps = {
      userId: createLogDTO.userId,
      logbookId: <string>createLogDTO.logbook.id,
      visibility: createLogDTO.logbook.visibility,
      date: new Date(), // reexamine this!!!!
      message: createLogDTO.message,
      durationOfWork: createLogDTO.durationOfWork,
      proofOfWorkImageUrl: proofOfWorkImageUrl,
    };
    const log = Log.create(createLogProps, this.uuidService);

    await this.logRepo.create(log, createLogDTO.user);
    return log;
  }
}
