import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("")
export default class ProductImage {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column("text")
  url: string;
}
