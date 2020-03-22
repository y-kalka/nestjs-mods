import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Payload = createParamDecorator((_, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().jwt.payload;
});
