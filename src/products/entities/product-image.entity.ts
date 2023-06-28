import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Product from "./product.entity";

@Entity()
export default class ProductImage {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column("text")
  url: string;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
