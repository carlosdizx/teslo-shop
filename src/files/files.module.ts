import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { S3Service } from "../common/services/s3.service";

@Module({
  controllers: [FilesController],
  providers: [FilesService, S3Service]
})
export class FilesModule {}
