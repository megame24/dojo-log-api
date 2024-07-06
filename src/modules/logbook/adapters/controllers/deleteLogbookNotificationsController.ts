import Adapter from "../../../shared/adapters/adapter";
import { DeleteLogbookNotifications } from "../../useCases/deleteLogbookNotifications";

export default class DeleteLogbookNotificationsController extends Adapter {
  constructor(private deleteLogbookNotifications: DeleteLogbookNotifications) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const { logbook } = req;

    const deleteLogbookNotificationsDTO = {
      logbookId: logbook.id,
    };

    try {
      await this.deleteLogbookNotifications.execute(
        deleteLogbookNotificationsDTO
      );
      res
        .status(200)
        .json({ message: "Logbook notifications deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
