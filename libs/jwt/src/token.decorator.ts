import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator((_, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().jwt.token;
});
