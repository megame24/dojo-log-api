import Adapter from "../../../shared/adapters/adapter";
import { DeleteReward } from "../../useCases/deleteReward";

export default class DeleteRewardController extends Adapter {
  constructor(private deleteReward: DeleteReward) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const deleteRewardDTO = {
      reward: req.reward,
    };

    try {
      await this.deleteReward.execute(deleteRewardDTO);
      res.status(200).json({ message: "Reward deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
