import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { isUUID } from "class-validator";
import PaginationDto from "../common/dto/pagination.dto";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger("ProductsService");
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>
  ) {}
  public create = async (createProductDto: CreateProductDto) => {
    try {
      const product = await this.repository.create(createProductDto);
      await this.repository.save(product);
      return product;
    } catch (error) {
      this.handleException(error);
    }
  };

  public findAll = async (pagination: PaginationDto) => {
    const { limit = 10, offset = 0 } = pagination;
    return this.repository.find({
      take: limit,
      skip: offset,
    });
  };

  public findOne = async (term: string) => {
    let product: Product;
    if (isUUID(term)) product = await this.repository.findOneBy({ id: term });
    else product = await this.repository.findOneBy({ slug: term });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  };

  public update = async (id: string, updateProductDto: UpdateProductDto) => {
    return `This action updates a #${id} product`;
  };

  public remove = async (id: string) => {
    const result = await this.repository.delete(id);
    if (result.affected === 0) throw new NotFoundException("Product not found");
    return { message: `Product was removed` };
  };

  private handleException = (error: any) => {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      "Unexpected error, check server logs"
    );
  };
}
