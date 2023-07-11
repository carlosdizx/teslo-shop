import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { Repository } from "typeorm";
import User from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) {}
  public registerUser = async (createUserDto: CreateUserDto) => {
    const user = this.repository.create({
      ...createUserDto,
      fullName: createUserDto.fullName.toUpperCase(),
    });
    return this.repository.save(user);
  };
}
