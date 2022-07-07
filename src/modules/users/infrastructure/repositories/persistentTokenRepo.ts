import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import PersistentToken, {
  TokenOrCodeType,
} from "../../entities/persistentToken";
import { SecurityService } from "../services/securityService";

export interface DeleteManyQueryOption {
  userId: string;
  type?: TokenOrCodeType;
}

export interface PersistentTokenRepo {
  create: (persistentToken: PersistentToken) => void;
  getByUserIdAndToken: (
    userId: string,
    token: string
  ) => Promise<PersistentToken | null>;
  deleteOne: (persistentToken: PersistentToken) => void;
  deleteMany: (deleteManyQueryOption: DeleteManyQueryOption) => void;
}

export class PersistentTokenRepoImpl implements PersistentTokenRepo {
  constructor(
    private PersistentTokenModel: any,
    private securityService: SecurityService,
    private uuidService: UUIDService
  ) {}

  async create(persistentToken: PersistentToken) {
    try {
      const persistentTokenProps = {
        id: persistentToken.id,
        userId: persistentToken.userId,
        token: persistentToken.token,
        type: persistentToken.type,
      };
      await this.PersistentTokenModel.create(persistentTokenProps);
    } catch (error: any) {
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
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error deleting persistentToken",
        error
      );
    }
  }

  async deleteMany(deleteManyQueryOption: DeleteManyQueryOption) {
    try {
      await this.PersistentTokenModel.destroy({
        where: {
          userId: deleteManyQueryOption.userId,
          type: deleteManyQueryOption.type,
        },
      });
    } catch (error: any) {
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
          id: tokenData.id,
          userId: tokenData.userId,
          token: tokenData.token,
          type: tokenData.type,
        },
        this.securityService,
        this.uuidService
      );
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error retrieving persistentToken",
        error
      );
    }
  }
}
