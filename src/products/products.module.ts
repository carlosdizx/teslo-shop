import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { Product, ProductImage } from "./index";
import ErrorHandler from "../common/utils/error-handler";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage]), AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, ErrorHandler],
})
export class ProductsModule {}
