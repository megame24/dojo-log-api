import { Visibility } from "../../../logbook/entities/logbook";
import AppError from "../../AppError";

export interface FileService {
  uploadFile: (
    file: any,
    userId: string,
    visibility: Visibility
  ) => Promise<string | void>;
  deleteFile: (
    fileName: string,
    userId: string,
    visibility: Visibility
  ) => void;
}

export class FileServiceImpl implements FileService {
  bucketClient: any;

  constructor(
    private BucketClient: any,
    private UploadObjectCommand: any,
    private DeleteObjectCommand: any
  ) {
    this.bucketClient = new this.BucketClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: <string>process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: <string>process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(
    file: any,
    userId: string,
    visibility: Visibility
  ): Promise<string | void> {
    if (file.size > 5000000)
      throw AppError.badRequestError(
        "File size limit exceeded, file must be 5mb or less"
      );

    const command = new this.UploadObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `${visibility}/${userId}/${file.originalname}`,
      Body: file.buffer,
    });

    try {
      await this.bucketClient.send(command);
      if (visibility === Visibility.public) {
        return `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/public/${userId}/${file.originalname}`;
      }
    } catch (error: any) {
      throw AppError.internalServerError("Error uploading file", error);
    }
  }

  async deleteFile(fileName: string, userId: string, visibility: Visibility) {
    const command = new this.DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `${visibility}/${userId}/${fileName}`,
    });

    try {
      await this.bucketClient.send(command);
    } catch (error: any) {
      throw AppError.internalServerError("Error deleting file", error);
    }
  }
}
