import UseCase from "../../shared/useCases/useCase";
import Logbook from "../entities/logbook";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";

interface DeleteLogbookDTO {
  logbook: Logbook;
}

export interface DeleteLogbook extends UseCase<DeleteLogbookDTO, void> {
  execute: (deleteLogbookDTO: DeleteLogbookDTO) => void;
}

export class DeleteLogbookImpl implements DeleteLogbook {
  constructor(private logbookRepo: LogbookRepo) {}

  async execute(deleteLogbookDTO: DeleteLogbookDTO) {
    const { logbook } = deleteLogbookDTO;

    await this.logbookRepo.delete(logbook);
  }
}
