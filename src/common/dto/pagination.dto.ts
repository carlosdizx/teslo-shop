import { IsOptional, IsPositive, Min } from "class-validator";
import { Type } from "class-transformer";

export default class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number;
}
