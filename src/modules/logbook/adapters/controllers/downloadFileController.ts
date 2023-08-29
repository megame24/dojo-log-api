import Adapter from "../../../shared/adapters/adapter";
import File from "../../entities/file";
import { DownloadFile } from "../../useCases/downloadFile";

export default class DownloadFileController extends Adapter {
  constructor(private downloadFile: DownloadFile) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const file: File = req.file;
    const downloadFileDTO = { file };

    try {
      const presignedUrl = await this.downloadFile.execute(downloadFileDTO);

      res.status(200).json({ presignedUrl });
    } catch (error) {
      next(error);
    }
  }
}
