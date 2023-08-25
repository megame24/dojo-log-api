import { FileService } from "../../shared/infrastructure/services/fileService";
import UseCase from "../../shared/useCases/useCase";
import File from "../entities/file";
import { FileRepo } from "../infrastructure/repositories/fileRepo";

interface DeleteFileDTO {
  userId: string;
  file: File;
}

export interface DeleteFile extends UseCase<DeleteFileDTO, void> {
  execute: (deleteFileDTO: DeleteFileDTO) => void;
}

export class DeleteFileImpl implements DeleteFile {
  constructor(private fileRepo: FileRepo, private fileService: FileService) {}

  async execute(deleteFileDTO: DeleteFileDTO) {
    const { file, userId } = deleteFileDTO;

    await this.fileService.deleteFile(file.name, userId, file.visibility);
    await this.fileRepo.delete(file);
  }
}
