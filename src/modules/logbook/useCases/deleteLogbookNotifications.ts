import UseCase from "../../shared/useCases/useCase";
import { LogbookNotificationRepo } from "../infrastructure/repositories/logbookNotificationRepo";

interface DeleteLogbookNotificationsDTO {
  logbookId: string;
}

export interface DeleteLogbookNotifications
  extends UseCase<DeleteLogbookNotificationsDTO, void> {
  execute: (
    deleteLogbookNotificationsDTO: DeleteLogbookNotificationsDTO
  ) => void;
}

export class DeleteLogbookNotificationsImpl
  implements DeleteLogbookNotifications
{
  constructor(private logbookNotificationRepo: LogbookNotificationRepo) {}

  async execute(deleteLogbookNotificationsDTO: DeleteLogbookNotificationsDTO) {
    const { logbookId } = deleteLogbookNotificationsDTO;

    await this.logbookNotificationRepo.deleteAllByLogbookId(logbookId);
  }
}
