import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import LogbookNotification from "../../entities/logbookNotification";

export interface LogbookNotificationRepo {
  deleteAllByLogbookId: (logbookId: string) => void;
  bulkUpsert: (logbookNotifications: LogbookNotification[]) => void;
  getLogbookNotificationByLogbookId: (
    logbookId: string
  ) => Promise<LogbookNotification | null>;
}

export class LogbookNotificationRepoImpl implements LogbookNotificationRepo {
  constructor(
    private LogbookNotificationModel: any,
    private uuidService: UUIDService
  ) {}

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
          updateOnDuplicate: ["id", "title", "body", "days", "hour"],
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

  async getLogbookNotificationByLogbookId(
    logbookId: string
  ): Promise<LogbookNotification | null> {
    if (!logbookId) throw AppError.badRequestError("logbookId is required");
    try {
      const logbookNotificationData =
        await this.LogbookNotificationModel.findOne({ where: { logbookId } });

      if (!logbookNotificationData) return null;

      const logbookNotificationProps = {
        id: logbookNotificationData.id,
        logbookId: logbookNotificationData.logbookId,
        title: logbookNotificationData.title,
        body: logbookNotificationData.body,
        days: logbookNotificationData.days,
        hour: logbookNotificationData.hour,
      };

      return LogbookNotification.create(
        logbookNotificationProps,
        this.uuidService
      );
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error getting logbook notification",
        error
      );
    }
  }
}
