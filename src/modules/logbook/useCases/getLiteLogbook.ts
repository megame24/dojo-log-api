import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import Logbook from "../entities/logbook";
import { LogbookRepo } from "../infrastructure/repositories/logbookRepo";

interface GetLiteLogbookDTO {
  logbookId: string;
}

export interface GetLiteLogbook
  extends UseCase<GetLiteLogbookDTO, Promise<Logbook>> {
  execute: (getLiteLogbookDTO: GetLiteLogbookDTO) => Promise<Logbook>;
}

export class GetLiteLogbookImpl implements GetLiteLogbook {
  constructor(private logbookRepo: LogbookRepo) {}

  async execute(getLiteLogbookDTO: GetLiteLogbookDTO): Promise<Logbook> {
    const { logbookId } = getLiteLogbookDTO;

    const logbook = await this.logbookRepo.getLiteLogbookById(logbookId);

    if (!logbook) throw AppError.notFoundError("Logbook not found");

    return logbook;
  }
}
