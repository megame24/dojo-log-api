import Adapter from "../../../shared/adapters/adapter";
import { BatchDeleteGoalNotifications } from "../../useCases/batchDeleteGoalNotifications";

export default class BatchDeleteGoalNotificationsController extends Adapter {
  constructor(
    private batchDeleteGoalNotifications: BatchDeleteGoalNotifications
  ) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const batchDeleteGoalNotificationsDTO = {
      goalNotifications: req.body.notifications,
    };

    try {
      await this.batchDeleteGoalNotifications.execute(
        batchDeleteGoalNotificationsDTO
      );
      res
        .status(200)
        .json({ message: "Goal notifications deleted successfully " });
    } catch (error) {
      next(error);
    }
  }
}
