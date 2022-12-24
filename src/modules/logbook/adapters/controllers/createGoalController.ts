import Adapter from "../../../shared/adapters/adapter";
import { DateService } from "../../../shared/infrastructure/services/dateService";
import { CreateGoal } from "../../useCases/createGoal";

export default class CreateGoalController extends Adapter {
  constructor(
    private createGoal: CreateGoal,
    private dateService: DateService
  ) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    try {
      const { body, files, user, logbook, rewards } = req;
      const rewardsProps = body.rewardsProps
        ? JSON.parse(body.rewardsProps)
        : {};
      const date = this.dateService.getTimelessDate(body.date);

      files?.forEach((file: any) => {
        if (rewardsProps[file.fieldname])
          rewardsProps[file.fieldname].file = file;
      });

      const createGoalDTO = {
        userId: logbook.userId,
        logbook,
        name: body.name,
        description: body.description,
        achievementCriteria: body.achievementCriteria,
        date,
        rewards,
        rewardsProps,
        user,
      };

      const goal = await this.createGoal.execute(createGoalDTO);
      res.status(201).json({ goalId: goal.id });
    } catch (error) {
      next(error);
    }
  }
}
