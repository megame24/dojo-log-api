import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import File from "../entities/file";
import { FileRepo } from "../infrastructure/repositories/fileRepo";

interface GetFileDTO {
  fileId: string;
}

export interface GetFile extends UseCase<GetFileDTO, Promise<File>> {
  execute: (getFileDTO: GetFileDTO) => Promise<File>;
}

export class GetFileImpl implements GetFile {
  constructor(private fileRepo: FileRepo) {}

  async execute(getFileDTO: GetFileDTO): Promise<File> {
    const { fileId } = getFileDTO;

    const file = await this.fileRepo.getFileById(fileId);

    if (!file) throw AppError.notFoundError("File not found");

    return file;
  }
}
