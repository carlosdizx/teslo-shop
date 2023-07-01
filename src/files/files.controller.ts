import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileFilter } from "./helpers/fileFilter.helper";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("product")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: fileFilter,
    })
  )
  public uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Make sure you file is image");
    return this.filesService.uploadImage(file);
  }

  @Get("product/:imageName")
  public findProductImage(@Param("imageName") imageName: string) {
    return this.filesService.getImage(imageName);
  }
}
