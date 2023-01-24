import { FileService } from "../../shared/infrastructure/services/fileService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import File from "../entities/file";
import { FileRepo } from "../infrastructure/repositories/fileRepo";

interface CreateFileDTO {
  userId: string;
  logId?: string;
  rewardId?: string;
  rawFile: any;
}

export interface CreateFile extends UseCase<CreateFileDTO, Promise<File>> {
  execute: (createFileDTO: CreateFileDTO) => Promise<File>;
}

export class CreateFileImpl implements CreateFile {
  constructor(
    private fileRepo: FileRepo,
    private uuidService: UUIDService,
    private fileService: FileService
  ) {}

  async execute(crateFileDTO: CreateFileDTO): Promise<File> {
    const { userId, logId, rewardId, rawFile } = crateFileDTO;

    const fileUrl = await this.fileService.uploadFile(rawFile);

    const createFileProps = {
      userId,
      logId,
      rewardId,
      name: rawFile.originalname,
      url: fileUrl,
      type: rawFile.mimetype,
    };
    const file = File.create(createFileProps, this.uuidService);

    await this.fileRepo.create(file);
    return file;
  }
}
