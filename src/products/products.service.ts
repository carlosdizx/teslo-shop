import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import Product from "./entities/product.entity";
import { isUUID } from "class-validator";
import PaginationDto from "../common/dto/pagination.dto";
import ProductImage from "./entities/product-image.entity";
import ErrorHandler from "../common/utils/error-handler";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly repositoryProductImage: Repository<ProductImage>,
    private datasource: DataSource,
    private errorHandler: ErrorHandler,
  ) {}
  public create = async (createProductDto: CreateProductDto) => {
    const { images = [], ...productDetails } = createProductDto;
    try {
      const product = await this.repository.create({
        ...productDetails,
        images: images.map((image) =>
          this.repositoryProductImage.create({ url: image })
        ),
      });
      await this.repository.save(product);
      return { ...product, images: product.images.map((image) => image.url) };
    } catch (error) {
      this.errorHandler.handleException(error, "ProductsService - create");
    }
  };

  public findAll = async (pagination: PaginationDto) => {
    const { limit = 10, offset = 0 } = pagination;
    const products = await this.repository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map((image) => image.url),
    }));
  };

  public findOne = async (term: string) => {
    let product: Product;
    if (isUUID(term)) product = await this.repository.findOneBy({ id: term });
    else {
      const queryBuilder = this.repository.createQueryBuilder("product");
      product = await queryBuilder
        .leftJoinAndSelect("product.images", "productImages")
        .where("LOWER(title) = LOWER(:title) or slug =:slug", {
          title: term,
          slug: term,
        })
        .getOne();
    }
    if (!product) throw new NotFoundException("Product not found");
    return { ...product, images: product.images.map((image) => image.url) };
  };

  public update = async (id: string, updateProductDto: UpdateProductDto) => {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.repository.preload({ id, ...toUpdate });
    if (!product) throw new NotFoundException("Product not found");
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, {
          product: { id },
        });

        product.images = images.map((image) =>
          this.repositoryProductImage.create({ url: image })
        );
      } else
        product.images = await this.repositoryProductImage.findBy({
          product: { id },
        });

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return { ...product, images: product.images.map((image) => image.url) };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.errorHandler.handleException(error, "ProductsService - update");
    }
  };

  public remove = async (id: string) => {
    const result = await this.repository.delete(id);
    if (result.affected === 0) throw new NotFoundException("Product not found");
    return { message: `Product was removed` };
  };
}
