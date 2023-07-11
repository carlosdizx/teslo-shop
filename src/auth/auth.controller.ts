import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import CreateUserDto from "./dto/create-user.dto";
import LoginUserDto from "./dto/login-user.dto";
import { AuthGuard } from "@nestjs/passport";
import getUser from "./decorators/get-user.decorator";
import User from "./entities/user.entity";

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
  @UseGuards(AuthGuard())
  test(@getUser() user: User) {
    return {
      message: "It's Ok",
      ok: true,
      user,
    };
  }
}
