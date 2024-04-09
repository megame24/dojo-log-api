import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import ExpoNotificationToken from "../../entities/expoNotificationToken";

export interface ExpoNotificationTokenRepo {
  create: (expoNotificationToken: ExpoNotificationToken) => void;
  getByToken: (token: string) => Promise<ExpoNotificationToken | null>;
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

  async getByToken(token: string): Promise<ExpoNotificationToken | null> {
    if (!token) throw AppError.badRequestError("token is required");

    const queryOption = { where: { token } };
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
