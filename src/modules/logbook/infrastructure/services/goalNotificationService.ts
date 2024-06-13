import { DateService } from "../../../shared/infrastructure/services/dateService";
import Goal from "../../entities/goal";

export interface GoalNotificationService {
  getGoalNotificationDate: (goal: Goal) => Date;
}

export class GoalNotificationServiceImpl implements GoalNotificationService {
  constructor(private dateService: DateService) {}

  getGoalNotificationDate(goal: Goal): Date {
    const goalDueDate = goal.date;
    const today = this.dateService.getEndOfDay(new Date());
    let notificationDate = this.dateService.addTimeToDate(today, 7, "d");

    if (new Date(notificationDate) > new Date(goalDueDate)) {
      const goalDueDateInLocalDate: any =
        this.dateService.convertDateStringToDate(goalDueDate, true);
      notificationDate = goalDueDateInLocalDate.$d;
    }

    return notificationDate;
  }
}
