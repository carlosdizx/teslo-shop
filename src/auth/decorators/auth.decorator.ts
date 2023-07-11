import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import UserRoleGuard from "../guards/user-role.guard";
import RoleProtected from "./role-protected.decorator";
import { Roles } from "../enums/roles.enum";

export function Auth(...roles: Roles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard)
  );
}
