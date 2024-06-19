import { DateService } from "../../../shared/infrastructure/services/dateService";
import Goal from "../../entities/goal";

interface GetGoalNotificationDateReturnValue {
  notificationDate: Date;
  finalNotificationDate: Date;
}

export interface GoalNotificationService {
  getGoalNotificationDate: (goal: Goal) => GetGoalNotificationDateReturnValue;
}

export class GoalNotificationServiceImpl implements GoalNotificationService {
  constructor(private dateService: DateService) {}

  getGoalNotificationDate(goal: Goal): GetGoalNotificationDateReturnValue {
    const goalDueDate = goal.date;
    const today = this.dateService.getEndOfDay(new Date());
    let notificationDate = this.dateService.addTimeToDate(today, 7, "d");

    const goalDueDateInLocalDate: any =
      this.dateService.convertDateStringToDate(goalDueDate, true);
    const finalNotificationDate = goalDueDateInLocalDate.$d;

    if (new Date(notificationDate) > new Date(goalDueDate)) {
      notificationDate = finalNotificationDate;
    }

    return {
      notificationDate,
      finalNotificationDate,
    };
  }
}
