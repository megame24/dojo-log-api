import AppError from "../../../shared/AppError";
import File from "../../entities/file";

export interface FileRepo {
  create: (file: File) => void;
}

export class FileRepoImpl implements FileRepo {
  constructor(private FileModel: any) {}

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
      };
      await this.FileModel.create(createFileProps);
    } catch (error: any) {
      throw AppError.internalServerError("Error creating file", error);
    }
  }
}
