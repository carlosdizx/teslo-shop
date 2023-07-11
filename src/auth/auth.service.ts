import { Injectable, UnauthorizedException } from "@nestjs/common";
import CreateUserDto from "./dto/create-user.dto";
import { Repository } from "typeorm";
import User from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import ErrorHandler from "../common/utils/error-handler";
import EncryptUtil from "../common/utils/encrypt-handler";
import LoginUserDto from "./dto/login-user.dto";

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
      const userSaved = await this.repository.save(user);
      delete userSaved.password;
      delete userSaved.isActive;
      return userSaved;
    } catch (error) {
      this.errorHandler.handleException(error, "AuthService - registerUser");
    }
  };

  public loginUser = async ({ email, password }: LoginUserDto) => {
    const userFound = await this.repository.findOne({
      where: { email },
      select: { email: true, password: true },
    });
    if (!userFound)
      throw new UnauthorizedException("Credentials are not valid (email)");
    if (!await this.encryptUtil.validatePassword(password, userFound.password))
      throw new UnauthorizedException("Credentials are not valid (password)");
    return userFound;
  };
}
