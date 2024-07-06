import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import UserLogbookNotification from "../../entities/userLogbookNotification";

export interface UserLogbookNotificationRepo {
  getAll: () => Promise<UserLogbookNotification[]>;
}

export class UserLogbookNotificationRepoImpl
  implements UserLogbookNotificationRepo
{
  constructor(private sequelize: any, private uuidService: UUIDService) {}

  async getAll(): Promise<UserLogbookNotification[]> {
    try {
      const sql = `
        SELECT 
          "Users"."name",
          "Logbooks"."userId",
          "Logbooks"."id" AS "logbookId",
          "LogbookNotifications".id AS "notificationId", 
          "LogbookNotifications"."title", 
          "LogbookNotifications"."body",
          "LogbookNotifications"."days",
          "LogbookNotifications"."hour",
          ARRAY_AGG("ExpoNotificationTokens"."token") AS "expoNotificationTokens"
        FROM 
          "LogbookNotifications" 
        JOIN 
          "Logbooks" ON "LogbookNotifications"."logbookId" = "Logbooks".id 
        JOIN 
          "Users" ON "Logbooks"."userId" = "Users".id
        LEFT JOIN 
          "ExpoNotificationTokens" ON "Users".id = "ExpoNotificationTokens"."userId"
        GROUP BY 
          "Users".id, "Logbooks".id, "LogbookNotifications".id
      `;

      const data = await this.sequelize.query(sql, {
        type: this.sequelize.QueryTypes.SELECT,
      });

      const userLogbookNotifications = data.map((element: any) => {
        const userLogbookNotificationProps = {
          name: element.name,
          userId: element.userId,
          logbookId: element.logbookId,
          notificationId: element.notificationId,
          title: element.title,
          body: element.body,
          days: element.days,
          hour: element.hour,
          expoNotificationTokens: element.expoNotificationTokens,
        };

        return UserLogbookNotification.create(
          userLogbookNotificationProps,
          this.uuidService
        );
      });

      return userLogbookNotifications;
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error getting user logbook notifications",
        error
      );
    }
  }
}
