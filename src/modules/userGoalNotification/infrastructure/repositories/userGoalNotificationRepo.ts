import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import UserGoalNotification from "../../entities/userGoalNotification";

export interface UserGoalNotificationRepo {
  getAllByDate: (date: Date) => Promise<UserGoalNotification[]>;
}

export class UserGoalNotificationRepoImpl implements UserGoalNotificationRepo {
  constructor(private sequelize: any, private uuidService: UUIDService) {}

  async getAllByDate(date: Date): Promise<UserGoalNotification[]> {
    try {
      const sql = `
        SELECT 
          "Users".email, 
          "Users"."name",
          "Goals"."name" AS "goalName",
          "Goals"."date" AS "dueDate", 
          "Goals"."userId",
          "Goals"."logbookId",
          "GoalNotifications".id AS "notificationId", 
          "GoalNotifications"."goalId", 
          "GoalNotifications"."notificationDate",
          ARRAY_AGG("ExpoNotificationTokens"."token") AS "expoNotificationTokens"
        FROM 
          "GoalNotifications" 
        JOIN 
          "Goals" ON "GoalNotifications"."goalId" = "Goals".id 
        JOIN 
          "Users" ON "Goals"."userId" = "Users".id
        LEFT JOIN 
          "ExpoNotificationTokens" ON "Users".id = "ExpoNotificationTokens"."userId"
        WHERE 
          "GoalNotifications"."notificationDate" <= :date
        GROUP BY 
          "Users".id, "Goals".id, "GoalNotifications".id
      `;

      const data = await this.sequelize.query(sql, {
        replacements: { date },
        type: this.sequelize.QueryTypes.SELECT,
      });

      const userGoalNotifications = data.map((element: any) => {
        const userGoalNotificationProps = {
          email: element.email,
          name: element.name,
          goalName: element.goalName,
          dueDate: element.dueDate,
          userId: element.userId,
          logbookId: element.logbookId,
          notificationId: element.notificationId,
          goalId: element.goalId,
          notificationDate: element.notificationDate,
          expoNotificationTokens: element.expoNotificationTokens,
        };

        return UserGoalNotification.create(
          userGoalNotificationProps,
          this.uuidService
        );
      });

      return userGoalNotifications;
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error getting user goal notifications",
        error
      );
    }
  }
}
