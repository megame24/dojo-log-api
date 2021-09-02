import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";
import Logbook from "../entities/logbook";

interface CreateLogDTO {
  userId: string;
  logbook: Logbook;
  message: string;
  date: Date;
  durationOfWork?: string;
  proofOfWorkImageUrl?: string;
}

export interface CreateLog extends UseCase<CreateLogDTO, void> {
  execute: (createLogDTO: CreateLogDTO) => void;
}

export class CreateLogImpl implements CreateLog {
  constructor(private logRepo: LogRepo, private uuidService: UUIDService) {}

  async execute(createLogDTO: CreateLogDTO) {
    const createLogProps = {
      userId: createLogDTO.userId,
      logbookId: <string>createLogDTO.logbook.id,
      visibility: createLogDTO.logbook.visibility,
      date: createLogDTO.date,
      message: createLogDTO.message,
      durationOfWork: createLogDTO.durationOfWork,
      proofOfWorkImageUrl: createLogDTO.proofOfWorkImageUrl,
    };
    const log = Log.create(createLogProps, this.uuidService);

    await this.logRepo.create(log);
  }
}
