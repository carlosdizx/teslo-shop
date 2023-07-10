import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  private readonly id: string;

  @Column("varchar")
  email: string;

  @Column("varchar")
  password: string;

  @Column("varchar")
  fullName: string;

  @Column("bool")
  isActive: boolean;

  @Column("text", {
    array: true,
    default: ["user"],
  })
  roles: string[];
}
