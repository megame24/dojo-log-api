import Adapter from "../../../shared/adapters/adapter";
import { CreateReward } from "../../useCases/createReward";

export default class CreateRewardController extends Adapter {
  constructor(private createReward: CreateReward) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const createRewardDTO = {
      userId: req.user.id,
      name: req.body.name,
      description: req.body.description,
      save: true,
      user: req.user,
      ...(req.files && { file: req.files[0] }),
    };

    try {
      const reward = await this.createReward.execute(createRewardDTO);
      res.status(201).json({ rewardId: reward.id });
    } catch (error) {
      next(error);
    }
  }
}
