import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import ExpoNotificationToken from "../../entities/expoNotificationToken";

export interface ExpoNotificationTokenRepo {
  create: (expoNotificationToken: ExpoNotificationToken) => void;
  getByTokenAndUserId: (
    token: string,
    userId: string
  ) => Promise<ExpoNotificationToken | null>;
}

export class ExpoNotificationTokenRepoImpl
  implements ExpoNotificationTokenRepo
{
  constructor(
    private ExpoNotificationTokenModel: any,
    private uuidService: UUIDService
  ) {}

  async create(expoNotificationToken: ExpoNotificationToken) {
    try {
      const expoNotificationTokenProps = {
        id: expoNotificationToken.id,
        userId: expoNotificationToken.userId,
        token: expoNotificationToken.token,
      };
      await this.ExpoNotificationTokenModel.create(expoNotificationTokenProps);
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error creating expoNotificationToken",
        error
      );
    }
  }

  async getByTokenAndUserId(
    token: string,
    userId: string
  ): Promise<ExpoNotificationToken | null> {
    if (!token || !userId)
      throw AppError.badRequestError("token and userId is required");

    const queryOption = { where: { token, userId } };
    let expoNotificationTokenData: any;

    try {
      expoNotificationTokenData = await this.ExpoNotificationTokenModel.findOne(
        queryOption
      );
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error retrieving expoNotificationToken",
        error
      );
    }

    if (!expoNotificationTokenData) return null;

    const expoNotificationTokenProps = {
      id: expoNotificationTokenData.id,
      userId: expoNotificationTokenData.userId,
      token: expoNotificationTokenData.token,
    };

    return ExpoNotificationToken.create(
      expoNotificationTokenProps,
      this.uuidService
    );
  }
}
