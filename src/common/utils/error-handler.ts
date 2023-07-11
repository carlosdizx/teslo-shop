import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";

@Injectable()
export default class ErrorHandler {
  private readonly logger = new Logger();
  public handleException = (error: any, context: string = "AppServiceFailed") => {
    if (error.code === "23505") throw new BadRequestException(error.detail);
    this.logger.error(error, "", context);
    throw new InternalServerErrorException(
      "Unexpected error, check server logs"
    );
  };
}
