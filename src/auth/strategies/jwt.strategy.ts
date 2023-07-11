import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import User from "../entities/user.entity";
import JwtPayload from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly configService: ConfigService
  ) {
    super({
      secretOrKey: configService.getOrThrow("JWT_SECRET"),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  public validate = async (payload: JwtPayload): Promise<User> => {
    const user = await this.repository.findOneBy({ email: payload.email });
    if (!user) throw new UnauthorizedException("Token not valid");
    if (!user.isActive)
      throw new UnauthorizedException("User is inactive, talk with an admin");
    return user;
  };
}
