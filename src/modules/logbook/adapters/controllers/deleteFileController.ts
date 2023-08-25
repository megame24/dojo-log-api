import Adapter from "../../../shared/adapters/adapter";
import { DeleteFile } from "../../useCases/deleteFile";

export default class DeleteFileController extends Adapter {
  constructor(private deleteFile: DeleteFile) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const deleteFileDTO = {
      userId: req.user.id,
      file: req.file,
    };

    try {
      await this.deleteFile.execute(deleteFileDTO);
      res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
