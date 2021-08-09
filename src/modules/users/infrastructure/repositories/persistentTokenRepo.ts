import AppError from "../../../shared/core/AppError";
import PersistentToken, {
  PersistentTokenProps,
} from "../../entities/persistentToken";
import { SecurityService } from "../services/securityService";

export interface PersistentTokenRepo {
  create: (persistentToken: PersistentToken) => void;
  getByUserIdAndToken: (
    userId: string,
    token: string
  ) => Promise<PersistentToken | null>;
  delete: (persistentToken: PersistentToken) => void;
}

export class PersistentTokenRepoImpl implements PersistentTokenRepo {
  constructor(
    private PersistentTokenModel: any,
    private securityService: SecurityService
  ) {}

  async create(persistentToken: PersistentToken) {
    try {
      const persistentTokenProps: PersistentTokenProps = {
        userId: persistentToken.userId,
        token: persistentToken.token,
      };
      await this.PersistentTokenModel.create(persistentTokenProps);
    } catch (error) {
      throw AppError.internalServerError(
        "Error creating persistentToken",
        error
      );
    }
  }

  async delete(persistentToken: PersistentToken) {
    try {
      await this.PersistentTokenModel.destroy({
        where: {
          userId: persistentToken.userId,
          token: persistentToken.token,
        },
      });
    } catch (error) {
      throw AppError.internalServerError(
        "Error deleting persistentToken",
        error
      );
    }
  }

  async getByUserIdAndToken(
    userId: string,
    token: string
  ): Promise<PersistentToken | null> {
    try {
      const tokenData = await this.PersistentTokenModel.findOne({
        where: { userId, token },
      });
      if (!tokenData) return null;
      return PersistentToken.create(
        {
          userId: tokenData.userId,
          token: tokenData.token,
        },
        this.securityService
      );
    } catch (error) {
      throw AppError.internalServerError(
        "Error retrieving persistentToken",
        error
      );
    }
  }
}
