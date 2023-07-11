import { Reflector } from "@nestjs/core";
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Roles } from "../enums/roles.enum";
import User from "../entities/user.entity";

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      "roles",
      context.getHandler()
    );

    const user: User = context.switchToHttp().getRequest().user;
    if (!user) throw new BadRequestException("User not found (request)");

    for (const rol of user.roles) {
      if (validRoles.includes(rol)) return true;
    }

    return false;
  }
}
