import { Injectable } from "@nestjs/common";
import { S3Service } from "../common/services/s3.service";
import { v4 as uuid } from "uuid";

@Injectable()
export class FilesService {
  constructor(private readonly s3Service: S3Service) {}

  public uploadImage = async (file: Express.Multer.File) => {
    const fileExtension = file.mimetype.split("/")[1];
    const fileName = `${uuid()}.${fileExtension}`;

    await this.s3Service.uploadObject(`products/${fileName}`, file.buffer);

    return { message: "Image uploaded successfully", file: fileName };
  };

  public getImage = async (key: string) => {
    return await this.s3Service.getFileUrl(`products/${key}`);
  };
}
