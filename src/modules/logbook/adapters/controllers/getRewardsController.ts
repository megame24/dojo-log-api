import Adapter from "../../../shared/adapters/adapter";
import { GetRewards } from "../../useCases/getRewards";

export default class GetRewardsController extends Adapter {
  constructor(private getRewards: GetRewards) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const getRewardsDTO = {
        userId: req.user.id,
      };

      const rewards = await this.getRewards.execute(getRewardsDTO);

      const rewardsResponseDTO = rewards.map((reward) => ({
        id: reward.id,
        name: reward.name,
        description: reward.description,
        ...(reward.image && {
          image: {
            id: reward?.image?.id,
            name: reward?.image?.name,
            rewardId: reward?.image?.rewardId,
            type: reward?.image?.type,
            url: reward?.image?.url,
          },
        }),
        userId: reward.userId,
      }));

      res.status(200).json(rewardsResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
