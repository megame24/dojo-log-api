import Adapter from "../../../shared/adapters/adapter";
import { GetLogbookNotification } from "../../useCases/getLogbookNotification";

export default class GetLogbookNotificationController extends Adapter {
  constructor(private getLogbookNotification: GetLogbookNotification) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { logbookId } = req.params;

    const getLogbookNotificationDTO = {
      logbookId,
    };

    try {
      const logbookNotification = await this.getLogbookNotification.execute(
        getLogbookNotificationDTO
      );

      const logbookNotificationResponseDTO = {
        id: logbookNotification.id,
        logbookId: logbookNotification.logbookId,
        title: logbookNotification.title,
        body: logbookNotification.body,
        days: logbookNotification.days,
        hour: logbookNotification.hour,
      };

      res.status(200).json(logbookNotificationResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
