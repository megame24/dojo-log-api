import Adapter from "../../../shared/adapters/adapter";
import { GetUserGoalNotifications } from "../../useCases/getUserGoalNotifications";

export default class GetUserGoalNotificationsController extends Adapter {
  constructor(private getUserGoalNotifications: GetUserGoalNotifications) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const { date } = req.query;
      const getUserGoalNotificationsDTO = { date };

      const userGoalNotifications = await this.getUserGoalNotifications.execute(
        getUserGoalNotificationsDTO
      );

      const userGoalNotificationsResponseDTO = userGoalNotifications.map(
        (userGoalNotification) => ({
          email: userGoalNotification.email,
          name: userGoalNotification.name,
          goalName: userGoalNotification.goalName,
          dueDate: userGoalNotification.dueDate,
          userId: userGoalNotification.userId,
          logbookId: userGoalNotification.logbookId,
          notificationId: userGoalNotification.notificationId,
          goalId: userGoalNotification.goalId,
          notificationDate: userGoalNotification.notificationDate,
          expoNotificationTokens: userGoalNotification.expoNotificationTokens,
        })
      );

      res.status(200).json(userGoalNotificationsResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
