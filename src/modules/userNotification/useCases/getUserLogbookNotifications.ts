import UseCase from "../../shared/useCases/useCase";
import UserLogbookNotification from "../entities/userLogbookNotification";
import { UserLogbookNotificationRepo } from "../infrastructure/repositories/userLogbookNotificationRepo";

export interface GetUserLogbookNotifications
  extends UseCase<void, Promise<UserLogbookNotification[]>> {
  execute: () => Promise<UserLogbookNotification[]>;
}

export class GetUserLogbookNotificationsImpl
  implements GetUserLogbookNotifications
{
  constructor(
    private userLogbookNotificationRepo: UserLogbookNotificationRepo
  ) {}

  async execute(): Promise<UserLogbookNotification[]> {
    const userLogbookNotifications =
      await this.userLogbookNotificationRepo.getAll();

    return userLogbookNotifications;
  }
}
