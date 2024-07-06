import Adapter from "../../../shared/adapters/adapter";
import { GetUserLogbookNotifications } from "../../useCases/getUserLogbookNotifications";

export default class GetUserLogbookNotificationsController extends Adapter {
  constructor(
    private getUserLogbookNotifications: GetUserLogbookNotifications
  ) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const userLogbookNotifications =
        await this.getUserLogbookNotifications.execute();

      const userLogbookNotificationsResponseDTO = userLogbookNotifications.map(
        (userLogbookNotification) => ({
          name: userLogbookNotification.name,
          userId: userLogbookNotification.userId,
          logbookId: userLogbookNotification.logbookId,
          notificationId: userLogbookNotification.notificationId,
          title: userLogbookNotification.title,
          body: userLogbookNotification.body,
          days: userLogbookNotification.days,
          hour: userLogbookNotification.hour,
          expoNotificationTokens:
            userLogbookNotification.expoNotificationTokens,
        })
      );

      res.status(200).json(userLogbookNotificationsResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
