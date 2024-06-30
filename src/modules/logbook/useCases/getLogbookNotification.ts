import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import LogbookNotification from "../entities/logbookNotification";
import { LogbookNotificationRepo } from "../infrastructure/repositories/logbookNotificationRepo";

interface GetLogbookNotificationDTO {
  logbookId: string;
}

export interface GetLogbookNotification
  extends UseCase<GetLogbookNotificationDTO, Promise<LogbookNotification>> {
  execute: (
    getLogbookNotificationDTO: GetLogbookNotificationDTO
  ) => Promise<LogbookNotification>;
}

export class GetLogbookNotificationImpl implements GetLogbookNotification {
  constructor(private logbookNotificationRepo: LogbookNotificationRepo) {}

  async execute(
    getLogbookNotificationDTO: GetLogbookNotificationDTO
  ): Promise<LogbookNotification> {
    const { logbookId } = getLogbookNotificationDTO;

    const logbookNotification =
      await this.logbookNotificationRepo.getLogbookNotificationByLogbookId(
        logbookId
      );
    if (!logbookNotification)
      throw AppError.notFoundError("Logbook notification not found");
    return logbookNotification;
  }
}
