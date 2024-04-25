import UseCase from "../../shared/useCases/useCase";
import ExpoNotificationToken from "../entities/expoNotificationToken";
import { ExpoNotificationTokenRepo } from "../infrastructure/repositories/expoNotificationTokenRepo";

export interface GetExpoNotificationTokens
  extends UseCase<void, Promise<ExpoNotificationToken[]>> {
  execute: () => Promise<ExpoNotificationToken[]>;
}

export class GetExpoNotificationTokensImpl
  implements GetExpoNotificationTokens
{
  constructor(private expoNotificationRepo: ExpoNotificationTokenRepo) {}

  async execute(): Promise<ExpoNotificationToken[]> {
    return this.expoNotificationRepo.getAll();
  }
}
