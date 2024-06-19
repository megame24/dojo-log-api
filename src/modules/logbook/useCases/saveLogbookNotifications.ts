import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import LogbookNotification, {
  LogbookNotificationProps,
} from "../entities/logbookNotification";
import { LogbookNotificationRepo } from "../infrastructure/repositories/logbookNotificationRepo";

interface SaveLogbookNotificationsDTO {
  notifications: LogbookNotificationProps[];
  logbookId: string;
}

export interface SaveLogbookNotifications
  extends UseCase<SaveLogbookNotificationsDTO, void> {
  execute: (saveLogbookNotificationsDTO: SaveLogbookNotificationsDTO) => void;
}

export class SaveLogbookNotificationsImpl implements SaveLogbookNotifications {
  constructor(
    private uuidService: UUIDService,
    private logbookNotificationRepo: LogbookNotificationRepo
  ) {}

  async execute(saveLogbookNotificationsDTO: SaveLogbookNotificationsDTO) {
    const { notifications } = saveLogbookNotificationsDTO;

    // await this.logbookNotificationRepo.deleteAllByLogbookId(logbookId);

    const logbookNotifications = notifications.map((notification) => {
      return LogbookNotification.create(notification, this.uuidService);
    });

    await this.logbookNotificationRepo.bulkUpsert(logbookNotifications);
  }
}
