import UseCase from "../../shared/useCases/useCase";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";

interface GetLogsDTO {
  logbookId: string;
  date: Date;
}

export interface GetLogs extends UseCase<GetLogsDTO, Promise<Log[]>> {
  execute: (getLogsDTO: GetLogsDTO) => Promise<Log[]>;
}

export class GetLogsImpl implements GetLogs {
  constructor(private logRepo: LogRepo) {}

  async execute(getLogsDTO: GetLogsDTO): Promise<Log[]> {
    const { logbookId, date: startDate } = getLogsDTO;

    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + 1
    );

    const logs = await this.logRepo.getLogsByLogbookIdStartAndEndDates(
      logbookId,
      startDate,
      endDate
    );

    return logs;
  }
}
