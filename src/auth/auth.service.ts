import { Injectable, UnauthorizedException } from "@nestjs/common";
import CreateUserDto from "./dto/create-user.dto";
import { Repository } from "typeorm";
import User from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import ErrorHandler from "../common/utils/error-handler";
import EncryptUtil from "../common/utils/encrypt-handler";
import LoginUserDto from "./dto/login-user.dto";
import JwtPayload from "./interfaces/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly errorHandler: ErrorHandler,
    private readonly encryptUtil: EncryptUtil,
    private readonly jwtService: JwtService
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
      delete user.password;
      return { ...user, token: this.generateJWT({ id: user.id }) };
    } catch (error) {
      this.errorHandler.handleException(error, "AuthService - registerUser");
    }
  };

  public loginUser = async ({ email, password }: LoginUserDto) => {
    const user = await this.repository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!user)
      throw new UnauthorizedException("Credentials are not valid (email)");
    if (!(await this.encryptUtil.validatePassword(password, user.password)))
      throw new UnauthorizedException("Credentials are not valid (password)");
    delete user.password;
    return { ...user, token: this.generateJWT({ id: user.id }) };
  };

  private generateJWT = (payload: JwtPayload) => {
    return this.jwtService.sign(payload);
  };
}
