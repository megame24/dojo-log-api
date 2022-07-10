import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import PersistentCode from "../../entities/persistentCode";
import { SecurityService } from "../services/securityService";

export interface PersistentCodeRepo {
  create: (persistentCode: PersistentCode) => void;
  getByUserIdAndType: (
    userId: string,
    type: string
  ) => Promise<PersistentCode | null>;
  deleteByUserIdAndType: (userId: string, type: string) => void;
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

  async deleteByUserIdAndType(userId: string, type: string) {
    try {
      await this.PersistentCodeModel.destroy({
        where: { userId, type },
      });
    } catch (error: any) {
      throw AppError.internalServerError(
        "Error deleting persistentCode",
        error
      );
    }
  }

  async getByUserIdAndType(
    userId: string,
    type: string
  ): Promise<PersistentCode | null> {
    try {
      const codeData = await this.PersistentCodeModel.findOne({
        where: { userId, type },
      });
      console.log(codeData);
      if (!codeData) return null;
      return PersistentCode.create(
        {
          id: codeData.id,
          userId: codeData.userId,
          encryptedCode: codeData.encryptedCode,
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
