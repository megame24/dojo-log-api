import AppError from "../../shared/AppError";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import ExpoNotificationToken from "../entities/expoNotificationToken";
import { ExpoNotificationTokenRepo } from "../infrastructure/repositories/expoNotificationTokenRepo";

interface CreateExpoNotificationTokenDTO {
  userId: string;
  token: string;
}

export interface CreateExpoNotificationToken
  extends UseCase<CreateExpoNotificationTokenDTO, void> {
  execute: (
    createExpoNotificationTokenDTO: CreateExpoNotificationTokenDTO
  ) => void;
}

export class CreateExpoNotificationTokenImpl
  implements CreateExpoNotificationToken
{
  constructor(
    private expoNotificationRepo: ExpoNotificationTokenRepo,
    private uuidService: UUIDService
  ) {}

  async execute(
    createExpoNotificationTokenDTO: CreateExpoNotificationTokenDTO
  ) {
    const { userId, token } = createExpoNotificationTokenDTO;

    const existingExpoNotificationToken =
      await this.expoNotificationRepo.getByTokenAndUserId(token, userId);
    if (existingExpoNotificationToken) {
      throw AppError.badRequestError("ExpoNotificationToken already exists");
    }

    const createExpoNotificationTokenProps = {
      userId,
      token,
    };
    const expoNotificationToken = ExpoNotificationToken.create(
      createExpoNotificationTokenProps,
      this.uuidService
    );

    await this.expoNotificationRepo.create(expoNotificationToken);
  }
}
