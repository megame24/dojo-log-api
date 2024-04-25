import Adapter from "../../../shared/adapters/adapter";
import { BatchUpdateGoalNotifications } from "../../useCases/batchUpdateGoalNotifications";

export default class BatchUpdateGoalNotificationsController extends Adapter {
  constructor(
    private batchUpdateGoalNotifications: BatchUpdateGoalNotifications
  ) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const batchUpdateGoalNotificationsDTO = {
      goalNotifications: req.body.notifications,
    };

    try {
      await this.batchUpdateGoalNotifications.execute(
        batchUpdateGoalNotificationsDTO
      );
      res
        .status(200)
        .json({ message: "Goal notifications updated successfully " });
    } catch (error) {
      next(error);
    }
  }
}
