import { Injectable } from "@nestjs/common";
import { S3Service } from "../common/services/s3.service";
@Injectable()
export class FilesService {
  constructor(private readonly s3Service: S3Service) {}

  public uploadImage = async (file: Express.Multer.File) => {
    const upload = await this.s3Service.uploadObject(
      file.originalname,
      file.buffer
    );
    return { message: "Image uploaded successfully", upload: upload };
  };
}
