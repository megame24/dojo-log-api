import UseCase from "../../shared/useCases/useCase";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";

interface GetLogsDTO {
  logbookId: string;
  startDate: Date;
  endDate: Date;
}

export interface GetLogs extends UseCase<GetLogsDTO, Promise<Log[]>> {
  execute: (getLogsDTO: GetLogsDTO) => Promise<Log[]>;
}

export class GetLogsImpl implements GetLogs {
  constructor(private logRepo: LogRepo) {}

  async execute(getLogsDTO: GetLogsDTO): Promise<Log[]> {
    const { logbookId, startDate, endDate } = getLogsDTO;

    const logs = await this.logRepo.getLogsByLogbookIdStartAndEndDates(
      logbookId,
      startDate,
      endDate,
      true
    );

    return logs;
  }
}
