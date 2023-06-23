import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column("text", { unique: true })
  title: string;
}
