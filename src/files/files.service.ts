import { Injectable } from "@nestjs/common";
import { S3Service } from "../common/services/s3.service";
@Injectable()
export class FilesService {
  constructor(private readonly s3Service: S3Service) {
    console.log("xd");
  }
}
