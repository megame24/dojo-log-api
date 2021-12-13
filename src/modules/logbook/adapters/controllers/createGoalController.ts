import Adapter from "../../../shared/adapters/adapter";
import { CreateGoal } from "../../useCases/createGoal";

export default class CreateGoalController extends Adapter {
  constructor(private createGoal: CreateGoal) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const { body, files, user, resourceOrParent } = req;
      const rewardIds = body.rewardIds ? JSON.parse(body.rewardIds) : [];
      const rewardsProps = body.rewardsProps
        ? JSON.parse(body.rewardsProps)
        : {};

      files?.forEach((file: any) => {
        rewardsProps[file.fieldname].file = file;
      });

      const createGoalDTO = {
        userId: user.id,
        logbook: resourceOrParent,
        name: body.name,
        description: body.description,
        achievementCriteria: body.achievementCriteria,
        date: body.date,
        rewardIds,
        rewardsProps,
      };

      await this.createGoal.execute(createGoalDTO);
      res.status(201).json({ message: "Goal created successfully" });
    } catch (error) {
      next(error);
    }
  }
}
