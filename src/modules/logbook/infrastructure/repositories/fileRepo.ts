import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import File from "../../entities/file";

export interface FileRepo {
  create: (file: File) => void;
  delete: (file: File) => void;
  getFileById: (fileId: string) => Promise<File | null>;
}

export class FileRepoImpl implements FileRepo {
  constructor(private FileModel: any, private uuidService: UUIDService) {}

  async create(file: File) {
    try {
      const createFileProps = {
        id: file.id,
        userId: file.userId,
        logId: file.logId,
        rewardId: file.rewardId,
        type: file.type,
        url: file.url,
        name: file.name,
        visibility: file.visibility,
      };
      await this.FileModel.create(createFileProps);
    } catch (error: any) {
      throw AppError.internalServerError("Error creating file", error);
    }
  }

  async delete(file: File) {
    try {
      await this.FileModel.destroy({ where: { id: file.id } });
    } catch (error: any) {
      throw AppError.internalServerError("Error deleting file", error);
    }
  }

  async getFileById(fileId: string): Promise<File | null> {
    const queryOption = {
      where: { id: fileId },
    };

    let fileData: any;

    try {
      fileData = await this.FileModel.findOne(queryOption);
    } catch (error: any) {
      throw AppError.internalServerError("Error retrieving File", error);
    }

    if (!fileData) return null;

    const fileProps = {
      id: fileData.id,
      userId: fileData.userId,
      logId: fileData.logId,
      rewardId: fileData.rewardId,
      type: fileData.type,
      url: fileData.url,
      name: fileData.name,
      visibility: fileData.visibility,
    };

    return File.create(fileProps, this.uuidService);
  }
}
