import Adapter from "../../../shared/adapters/adapter";
import Reward from "../../entities/reward";

export default class GetGoalController extends Adapter {
  async execute(req: any, res: any, next: any) {
    try {
      const { goal } = req;
      const goalResponseDTO = {
        id: goal.id,
        logbookId: goal.logbookId,
        userId: goal.userId,
        visibility: goal.visibility,
        name: goal.name,
        achieved: goal.achieved,
        achievementCriteria: goal.achievementCriteria,
        date: goal.date,
        rewards: [],
      };

      goalResponseDTO.rewards = goal.props.rewards.map((reward: Reward) => ({
        id: reward.id,
        userId: reward.userId,
        name: reward.name,
        description: reward.description,
        ...(reward.image && {
          image: {
            id: reward.image.id,
            userId: reward.image.userId,
            rewardId: reward.image.rewardId,
            type: reward.image.type,
            url: reward.image.url,
            name: reward.image.name,
          },
        }),
      }));

      res.status(200).json(goalResponseDTO);
    } catch (error) {
      next(error);
    }
  }
}
