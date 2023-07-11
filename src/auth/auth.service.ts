import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { Repository } from "typeorm";
import User from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import ErrorHandler from "../common/utils/error-handler";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly errorHandler: ErrorHandler
  ) {}
  public registerUser = async (createUserDto: CreateUserDto) => {
    try {
      const user = this.repository.create({
        ...createUserDto,
        fullName: createUserDto.fullName.toUpperCase(),
      });
      const userSaved = await this.repository.save(user);
      return { ...userSaved, isActive: undefined, roles: undefined };
    } catch (error) {
      this.errorHandler.handleException(error);
    }
  };
}
