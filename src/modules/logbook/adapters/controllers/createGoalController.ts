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
      const { body, files, user, logbook } = req;
      const rewardsProps = body.rewardsProps
        ? JSON.parse(body.rewardsProps)
        : {};
      const rewards = body.rewards ? JSON.parse(body.rewards) : [];
      // Rethink this!!! Maybe just use what was sent from UI which should be in UTC
      const date = this.dateService.getTimelessDate(body.dueDate);

      files?.forEach((file: any) => {
        if (rewardsProps[file.fieldname])
          rewardsProps[file.fieldname].file = file;
      });

      const createGoalDTO = {
        userId: logbook.userId,
        logbook,
        name: body.name,
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
