import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from "@nestjs/common";

const getUser = createParamDecorator((data, context: ExecutionContext) => {
  const { user } = context.switchToHttp().getRequest();
  if (!user) throw new InternalServerErrorException("User not found (request)");
  return user;
});

export default getUser;
