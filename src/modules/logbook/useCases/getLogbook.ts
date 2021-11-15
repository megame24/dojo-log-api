import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import Logbook from "../entities/logbook";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";

interface GetLogbookDTO {
  logbookId: string;
  year: number;
}

export interface GetLogbook extends UseCase<GetLogbookDTO, Promise<Logbook>> {
  execute: (getLogbookDTO: GetLogbookDTO) => Promise<Logbook>;
}

// page & limit = yearly!!!

export class GetLogbookImpl implements GetLogbook {
  constructor(private logbookRepo: LogbookRepo) {}

  async execute(getLogbookDTO: GetLogbookDTO): Promise<Logbook> {
    const { logbookId, year } = getLogbookDTO;

    const startDate = new Date(year, 0, 1); //????????
    const endDate = new Date(year, 11, 31, 24, 59, 59, 999); //????????

    const logbook = await this.logbookRepo.getLogbookById(logbookId, {});

    if (!logbook) throw AppError.notFoundError("Logbook not found");

    return logbook;
  }
}
