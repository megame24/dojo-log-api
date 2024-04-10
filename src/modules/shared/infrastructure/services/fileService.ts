import File from "../../../logbook/entities/file";
import { Visibility } from "../../../logbook/entities/logbook";
import AppError from "../../AppError";

export interface FileService {
  uploadFile: (
    file: any,
    userId: string,
    visibility: Visibility
  ) => Promise<string | void>;
  deleteFile: (file: File) => void;
  downloadFile: (file: File) => Promise<string>;
  deleteAllUserFiles: (userId: string, visibility: Visibility) => void;
}

export class FileServiceImpl implements FileService {
  bucketClient: any;

  constructor(
    private BucketClient: any,
    private UploadObjectCommand: any,
    private DeleteObjectCommand: any,
    private DeleteObjectsCommand: any,
    private ListObjectsV2Command: any,
    private GetObjectCommand: any,
    private getSignedUrl: any,
    private NodeHttpHandler: any
  ) {
    this.bucketClient = new this.BucketClient({
      region: process.env.AWS_REGION,
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

    try {
      const command = new this.UploadObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${visibility}/${userId}/${file.originalname}`,
        Body: file.buffer,
      });

      await this.bucketClient.send(command);
      if (visibility === Visibility.public) {
        return `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/public/${userId}/${file.originalname}`;
      }
    } catch (error: any) {
      throw AppError.internalServerError("Error uploading file", error);
    }
  }

  async deleteFile({ visibility, userId, name }: File) {
    try {
      const command = new this.DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${visibility}/${userId}/${name}`,
      });

      await this.bucketClient.send(command);
    } catch (error: any) {
      throw AppError.internalServerError("Error deleting file", error);
    }
  }

  async deleteAllUserFiles(userId: string, visibility: Visibility) {
    const folderPath = `${visibility}/${userId}/`;

    const deleteFolder = async (folder: string) => {
      // List all objects with the folder prefix
      const listParams = {
        Bucket: process.env.BUCKET_NAME,
        Prefix: folder,
      };

      try {
        const listedObjects = await this.bucketClient.send(
          new this.ListObjectsV2Command(listParams)
        );

        if (!(listedObjects.Contents && listedObjects.Contents.length !== 0))
          return;

        // Delete objects
        const deleteParams = {
          Bucket: process.env.BUCKET_NAME,
          Delete: {
            Objects: listedObjects.Contents.map(({ Key }: any) => ({ Key })),
          },
        };
        await this.bucketClient.send(
          new this.DeleteObjectsCommand(deleteParams)
        );

        // Check if there are more objects to delete (pagination)
        if (listedObjects.IsTruncated) await deleteFolder(folder);
      } catch (error: any) {
        throw AppError.internalServerError(
          "Error deleting all user files",
          error
        );
      }
    };

    await deleteFolder(folderPath);
  }

  async downloadFile({ visibility, userId, name }: File): Promise<string> {
    try {
      const command = new this.GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${visibility}/${userId}/${name}`,
      });

      const presignedUrl = await this.getSignedUrl(this.bucketClient, command, {
        expiresIn: 3600,
        requestHandler: new this.NodeHttpHandler(),
      });

      return presignedUrl;
    } catch (error: any) {
      throw AppError.internalServerError("Error getting file", error);
    }
  }
}
