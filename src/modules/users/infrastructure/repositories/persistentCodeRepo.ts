import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import PersistentCode from "../../entities/persistentCode";
import { SecurityService } from "../services/securityService";
import { DeleteManyQueryOption } from "./persistentTokenRepo";

export interface PersistentCodeRepo {
  create: (persistentCode: PersistentCode) => void;
  getByUserIdAndCode: (
    userId: string,
    code: string
  ) => Promise<PersistentCode | null>;
  deleteOne: (persistentCode: PersistentCode) => void;
  deleteMany: (deleteManyQueryOption: DeleteManyQueryOption) => void;
}

export class PersistentCodeRepoImpl implements PersistentCodeRepo {
  constructor(
    private PersistentCodeModel: any,
    private securityService: SecurityService,
    private uuidService: UUIDService
  ) {}

  async create(persistentCode: PersistentCode) {
    try {
      const persistentCodeProps = {
        id: persistentCode.id,
        userId: persistentCode.userId,
        encryptedCode: persistentCode.encryptedCode,
        type: persistentCode.type,
        expiresIn: persistentCode.expiresIn,
      };
      await this.PersistentCodeModel.create(persistentCodeProps);
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error creating persistentCode",
        error
      );
    }
  }

  async deleteOne(persistentCode: PersistentCode) {
    try {
      await this.PersistentCodeModel.destroy({
        where: {
          userId: persistentCode.userId,
          code: persistentCode.code,
        },
      });
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error deleting persistentCode",
        error
      );
    }
  }

  async deleteMany(deleteManyQueryOption: DeleteManyQueryOption) {
    try {
      await this.PersistentCodeModel.destroy({
        where: {
          userId: deleteManyQueryOption.userId,
          type: deleteManyQueryOption.type,
        },
      });
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error deleting persistentCode",
        error
      );
    }
  }

  async getByUserIdAndCode(
    userId: string,
    code: string
  ): Promise<PersistentCode | null> {
    try {
      const codeData = await this.PersistentCodeModel.findOne({
        where: { userId, code },
      });
      if (!codeData) return null;
      return PersistentCode.create(
        {
          id: codeData.id,
          userId: codeData.userId,
          code: codeData.code,
          type: codeData.type,
          expiresIn: codeData.expiresIn,
        },
        this.securityService,
        this.uuidService
      );
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error retrieving persistentCode",
        error
      );
    }
  }
}
