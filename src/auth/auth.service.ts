import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { Repository } from "typeorm";
import User from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import ErrorHandler from "../common/utils/error-handler";
import EncryptUtil from "../common/utils/encrypt-handler";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly errorHandler: ErrorHandler,
    private readonly encryptUtil: EncryptUtil
  ) {}
  public registerUser = async (createUserDto: CreateUserDto) => {
    try {
      const user = this.repository.create({
        ...createUserDto,
        password: await this.encryptUtil.encryptPassword(
          createUserDto.password
        ),
        fullName: createUserDto.fullName.toUpperCase(),
      });
      await this.repository.save(user);
      return { email: createUserDto.email, fullName: createUserDto.fullName };
    } catch (error) {
      this.errorHandler.handleException(error, "AuthService - registerUser");
    }
  };
}
