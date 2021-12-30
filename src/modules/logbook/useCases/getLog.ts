import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import Log from "../entities/log";
import { LogRepo } from "../infrastructure/repositories/logRepo";

interface GetLogDTO {
  logId: string;
}

export interface GetLog extends UseCase<GetLogDTO, Promise<Log>> {
  execute: (getLogDTO: GetLogDTO) => Promise<Log>;
}

export class GetLogImpl implements GetLog {
  constructor(private logRepo: LogRepo) {}

  async execute(getLogDTO: GetLogDTO): Promise<Log> {
    const { logId } = getLogDTO;

    const log = await this.logRepo.getLogById(logId);

    if (!log) throw AppError.notFoundError("Log not found");

    return log;
  }
}
