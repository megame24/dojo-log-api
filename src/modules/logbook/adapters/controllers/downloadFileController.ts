import AppError from "../../../shared/AppError";
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
      const readableStream = await this.downloadFile.execute(downloadFileDTO);

      readableStream.on("error", (error: any) => {
        throw AppError.internalServerError("Error streaming file", error);
      });

      res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);
      res.setHeader("Content-Type", "application/octet-stream");

      readableStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }
}
