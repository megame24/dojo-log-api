import UseCase from "../../shared/useCases/useCase";
import UserGoalNotification from "../entities/userGoalNotification";
import { UserGoalNotificationRepo } from "../infrastructure/repositories/userGoalNotificationRepo";

interface GetUserGoalNotificationsDTO {
  date: Date;
}

export interface GetUserGoalNotifications
  extends UseCase<
    GetUserGoalNotificationsDTO,
    Promise<UserGoalNotification[]>
  > {
  execute: (
    getUserGoalNotificationsDTO: GetUserGoalNotificationsDTO
  ) => Promise<UserGoalNotification[]>;
}

export class GetUserGoalNotificationsImpl implements GetUserGoalNotifications {
  constructor(private userGoalNotificationRepo: UserGoalNotificationRepo) {}

  async execute(
    getUserGoalNotificationsDTO: GetUserGoalNotificationsDTO
  ): Promise<UserGoalNotification[]> {
    const { date } = getUserGoalNotificationsDTO;

    const userGoalNotifications =
      await this.userGoalNotificationRepo.getAllByDate(date);

    return userGoalNotifications;
  }
}
