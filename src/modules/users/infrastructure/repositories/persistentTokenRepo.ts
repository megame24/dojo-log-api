import AppError from "../../../shared/core/AppError";
import PersistentToken, { TokenType } from "../../entities/persistentToken";
import { SecurityService } from "../services/securityService";

interface DeleteManyQueryOption {
  userId: string;
  type?: TokenType;
}

export interface PersistentTokenRepo {
  create: (persistentToken: PersistentToken) => void;
  getByUserIdAndToken: (
    userId: string,
    token: string
  ) => Promise<PersistentToken | null>;
  deleteOne: (persistentToken: PersistentToken) => void;
  deleteMany: (queryOption: DeleteManyQueryOption) => void;
}

export class PersistentTokenRepoImpl implements PersistentTokenRepo {
  constructor(
    private PersistentTokenModel: any,
    private securityService: SecurityService
  ) {}

  async create(persistentToken: PersistentToken) {
    try {
      const persistentTokenProps = {
        userId: persistentToken.userId,
        token: persistentToken.token,
        type: persistentToken.type,
      };
      await this.PersistentTokenModel.create(persistentTokenProps);
    } catch (error) {
      throw AppError.internalServerError(
        "Error creating persistentToken",
        error
      );
    }
  }

  async deleteOne(persistentToken: PersistentToken) {
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

  async deleteMany(queryOption: DeleteManyQueryOption) {
    try {
      await this.PersistentTokenModel.destroy({
        where: {
          userId: queryOption.userId,
          type: queryOption.type,
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
          type: tokenData.type,
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
