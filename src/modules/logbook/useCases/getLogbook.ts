import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import Logbook from "../entities/logbook";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";

interface GetLogbookDTO {
  logbookId: string;
  startDate: Date;
  endDate: Date;
}

export interface GetLogbook extends UseCase<GetLogbookDTO, Promise<Logbook>> {
  execute: (getLogbookDTO: GetLogbookDTO) => Promise<Logbook>;
}

export class GetLogbookImpl implements GetLogbook {
  constructor(private logbookRepo: LogbookRepo) {}

  async execute(getLogbookDTO: GetLogbookDTO): Promise<Logbook> {
    const { logbookId, startDate, endDate } = getLogbookDTO;

    const logbook = await this.logbookRepo.getLogbookById(logbookId, {
      startDate,
      endDate,
    });

    if (!logbook) throw AppError.notFoundError("Logbook not found");

    return logbook;
  }
}
