import { FileService } from "../../shared/infrastructure/services/fileService";
import UseCase from "../../shared/useCases/useCase";
import File from "../entities/file";

interface DownloadFileDTO {
  file: File;
}

export interface DownloadFile
  extends UseCase<DownloadFileDTO, Promise<string>> {
  execute: (downloadFileDTO: DownloadFileDTO) => Promise<string>;
}

export class DownloadFileImpl implements DownloadFile {
  constructor(private fileService: FileService) {}

  async execute(downloadFileDTO: DownloadFileDTO): Promise<string> {
    const { file } = downloadFileDTO;

    return this.fileService.downloadFile(file);
  }
}
