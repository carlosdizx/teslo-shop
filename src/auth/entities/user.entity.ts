import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  private readonly id: string;

  @Column("varchar", { unique: true })
  email: string;

  @Column("varchar", { select: false })
  password: string;

  @Column("varchar")
  fullName: string;

  @Column("bool", { default: true })
  isActive: boolean;

  @Column("text", {
    array: true,
    default: ["user"],
  })
  roles: string[];

  @BeforeInsert()
  public insertEmailToLower = () => {
    this.email = this.email.toLowerCase().trim();
  };

  @BeforeUpdate()
  public updateEmailToLower = () => {
    this.email = this.email.toLowerCase().trim();
  };
}
