import { Injectable, NotFoundException } from '@nestjs/common';
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from 'dotenv';

config();

const Bucket = process.env.S3_BUCKET_NAME;
const region = process.env.S3_BUCKET_REGION;

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor() {
    console.log("Cargado S3 service");
    this.s3Client = new S3Client({ region });
  }

  async getFileContent(Key: string) {
    const getObjectCommand = new GetObjectCommand({
      Bucket,
      Key,
    });

    try {
      return await this.s3Client.send(getObjectCommand);
    } catch (error) {
      console.log(error);
      throw new NotFoundException("File in S3 does not exist");
    }
  }

  async uploadObject(Key: string, body: any) {
    const putObjectCommand = new PutObjectCommand({ Bucket, Key, Body: body });
    try {
      return await this.s3Client.send(putObjectCommand);
    } catch (error) {
      console.log(error);
      throw new NotFoundException("File in S3 does not exist");
    }
  }
}
