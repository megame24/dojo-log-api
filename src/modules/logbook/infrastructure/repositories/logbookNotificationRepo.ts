import AppError from "../../../shared/AppError";
import LogbookNotification from "../../entities/logbookNotification";

export interface LogbookNotificationRepo {
  deleteAllByLogbookId: (logbookId: string) => void;
  bulkUpsert: (logbookNotifications: LogbookNotification[]) => void;
}

export class LogbookNotificationRepoImpl implements LogbookNotificationRepo {
  constructor(private LogbookNotificationModel: any) {}

  async bulkUpsert(logbookNotifications: LogbookNotification[]) {
    try {
      const logbookNotificationsProps = logbookNotifications.map(
        (logbookNotification: LogbookNotification) => ({
          id: logbookNotification.id,
          logbookId: logbookNotification.logbookId,
          title: logbookNotification.title,
          body: logbookNotification.body,
          days: logbookNotification.days,
          hour: logbookNotification.hour,
        })
      );

      await this.LogbookNotificationModel.bulkCreate(
        logbookNotificationsProps,
        {
          updateOnDuplicate: ["id"],
        }
      );
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error saving logbook notification",
        error
      );
    }
  }

  async deleteAllByLogbookId(logbookId: string) {
    try {
      await this.LogbookNotificationModel.destroy({ where: { logbookId } });
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error deleting logbook notification",
        error
      );
    }
  }
}
