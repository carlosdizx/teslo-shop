import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column("text", { unique: true })
  title: string;

  @Column("float", { default: 0 })
  price: number;

  @Column("text", { nullable: true })
  description: string;

  @Column("text", { unique: true })
  slug: string;

  @Column("int", { default: 0 })
  stock: number;

  @Column("text", { array: true })
  sizes: string[];

  @Column("text")
  gender: string;

  @BeforeInsert()
  checkSlug = () => {
    if (!this.slug) this.slug = this.title;
    this.slug = this.slug.toLowerCase().replaceAll(" ", "_").replaceAll("'", "");
  };
}
