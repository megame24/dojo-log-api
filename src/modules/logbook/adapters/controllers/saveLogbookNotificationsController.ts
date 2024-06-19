import Adapter from "../../../shared/adapters/adapter";
import { SaveLogbookNotifications } from "../../useCases/saveLogbookNotifications";

export default class SaveLogbookNotificationsController extends Adapter {
  constructor(private saveLogbookNotifications: SaveLogbookNotifications) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const {
      logbook,
      body: { notifications },
    } = req;

    const saveLogbookNotificationsDTO = {
      logbookId: logbook.id,
      notifications,
    };

    try {
      await this.saveLogbookNotifications.execute(saveLogbookNotificationsDTO);
      res
        .status(200)
        .json({ message: "Logbook notifications saved successfully" });
    } catch (error) {
      next(error);
    }
  }
}
