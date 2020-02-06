import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { TokenData } from './token-data.interface';

export const Token = createParamDecorator((_, req: Request & { jwt: TokenData; }) => {
  return req.jwt.token;
});
