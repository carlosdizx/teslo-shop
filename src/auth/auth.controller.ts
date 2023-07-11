import {
  Body,
  Controller,
  Get,
  Post,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import CreateUserDto from "./dto/create-user.dto";
import LoginUserDto from "./dto/login-user.dto";
import { AuthGuard } from "@nestjs/passport";
import getUser from "./decorators/get-user.decorator";
import User from "./entities/user.entity";
import { Roles } from "./enums/roles.enum";
import { UserRoleGuard } from "./guards/user-role.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("singUp")
  singUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post("singIn")
  singIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get("test")
  @SetMetadata("roles", [Roles.ADMIN, Roles.SUPERUSER])
  @UseGuards(AuthGuard(), UserRoleGuard)
  test(@getUser() user: User) {
    return {
      message: "It's Ok",
      ok: true,
      user,
    };
  }
}
