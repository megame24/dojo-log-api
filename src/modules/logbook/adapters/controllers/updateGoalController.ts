import Adapter from "../../../shared/adapters/adapter";
import { UpdateGoal } from "../../useCases/updateGoal";

export default class UpdateGoalController extends Adapter {
  constructor(private updateGoal: UpdateGoal) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const { body, files, rewards, goal, user } = req;
      const achieved = body.achieved ? JSON.parse(body.achieved) : undefined;
      const rewardsProps = body.rewardsProps
        ? JSON.parse(body.rewardsProps)
        : {};

      files?.forEach((file: any) => {
        if (rewardsProps[file.fieldname])
          rewardsProps[file.fieldname].file = file;
      });

      const updateGoalDTO = {
        goal,
        name: body.name,
        achievementCriteria: body.achievementCriteria,
        achieved,
        rewards,
        rewardsProps,
        user,
      };

      await this.updateGoal.execute(updateGoalDTO);
      res.status(200).json({ message: "Goal updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}
