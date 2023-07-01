import { Injectable, NotFoundException } from '@nestjs/common';
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import { config } from 'dotenv';

config();

const Bucket = process.env.S3_BUCKET_NAME;
const region = process.env.S3_BUCKET_REGION;

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({ region });
  }

  public getFileUrl = async (Key: string) => {
    const command = new HeadObjectCommand({
      Bucket,
      Key
    });

    try {
      await this.s3Client.send(command);
      return await getSignedUrl(this.s3Client, new GetObjectCommand({ Bucket, Key }), {
        expiresIn: 3600
      });
    } catch (e) {
      throw new NotFoundException("File in S3 does not exist");
    }
  };

  async uploadObject(Key: string, body: any) {
    const putObjectCommand = new PutObjectCommand({ Bucket, Key, Body: body });
    try {
      return await this.s3Client.send(putObjectCommand);
    } catch (error) {
      console.log(error);
      throw new NotFoundException("Bucket or folder not found in S3");
    }
  }
}
