import Adapter from "../../../shared/adapters/adapter";
import { UpdateReward } from "../../useCases/updateReward";

export default class UpdateRewardController extends Adapter {
  constructor(private updateReward: UpdateReward) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const updateRewardDTO = {
      reward: req.reward,
      name: req.body.name,
      description: req.body.description,
      file: null,
      user: req.user,
    };

    if (req.files) updateRewardDTO.file = req.files[0];

    try {
      await this.updateReward.execute(updateRewardDTO);
      res.status(200).json({ message: "Reward updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}
