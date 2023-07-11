import { Reflector } from "@nestjs/core";
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Observable } from "rxjs";
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

    if (!validRoles) throw new BadRequestException("Roles are required");

    const user: User = context.switchToHttp().getRequest().user;
    if (!user) throw new BadRequestException("User not found (request)");

    for (const rol of user.roles) {
      if (validRoles.includes(rol)) return true;
    }

    throw new ForbiddenException(
      "You have not authorized, you have not permission"
    );
  }
}
