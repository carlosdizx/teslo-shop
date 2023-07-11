import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Roles } from "../enums/roles.enum";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column("varchar", { unique: true })
  email: string;

  @Column("varchar", { select: false })
  password: string;

  @Column("varchar")
  fullName: string;

  @Column("bool", { default: true })
  isActive: boolean;

  @Column("enum", {
    enum: Roles,
    array: true,
    default: [Roles.USER],
  })
  roles: Roles[];

  @BeforeInsert()
  public insertEmailToLower = () => {
    this.email = this.email.toLowerCase().trim();
  };

  @BeforeUpdate()
  public updateEmailToLower = () => {
    this.email = this.email.toLowerCase().trim();
  };
}
