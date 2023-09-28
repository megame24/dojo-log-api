import Adapter from "../../../shared/adapters/adapter";
import { CreateGoal } from "../../useCases/createGoal";

export default class CreateGoalController extends Adapter {
  constructor(private createGoal: CreateGoal) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const { body, files, user, logbook } = req;
      const rewardsProps = body.rewardsProps
        ? JSON.parse(body.rewardsProps)
        : {};
      const rewards = body.rewards ? JSON.parse(body.rewards) : [];

      files?.forEach((file: any) => {
        if (rewardsProps[file.fieldname])
          rewardsProps[file.fieldname].file = file;
      });

      const createGoalDTO = {
        userId: logbook.userId,
        logbook,
        name: body.name,
        achievementCriteria: body.achievementCriteria,
        date: body.dueDate,
        rewards,
        rewardsProps,
        user,
      };

      const goal = await this.createGoal.execute(createGoalDTO);
      res.status(201).json({ goalId: goal.id });
      next();
    } catch (error) {
      next(error);
    }
  }
}
