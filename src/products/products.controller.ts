import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import PaginationDto from "../common/dto/pagination.dto";
import Auth from "../auth/decorators/auth.decorator";
import { Roles } from "../auth/enums/roles.enum";
import User from "../auth/entities/user.entity";
import getUser from "../auth/decorators/get-user.decorator";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(Roles.ADMIN)
  create(@Body() createProductDto: CreateProductDto, @getUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.productsService.findAll(pagination);
  }

  @Get(":term")
  findOne(@Param("term") term: string) {
    return this.productsService.findOne(term);
  }

  @Patch(":id")
  @Auth(Roles.ADMIN)
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @getUser() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(":id")
  @Auth(Roles.ADMIN)
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
