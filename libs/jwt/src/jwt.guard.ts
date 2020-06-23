import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthType } from './auth-type.enum';
import { TokenService } from './token.service';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
    private tokenService: TokenService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authType = this.reflector.get<AuthType>('jwt-mode', context.getHandler());
    let req: Request & { jwt: any; session: any; };
    let token: string;
    let payload: any;

    // skip token validation on public routes
    if (authType === AuthType.public) {
      return true;
    }

    req = context.switchToHttp().getRequest();
    token = this.tokenService.getJwtTokenFromHttpRequest(req);

    // if no token was
    if (!token) {
      throw new UnauthorizedException();
    }

    // decode token
    try {
      payload = await this.tokenService.verifyToken(token);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }

    // check that token is not blacklisted if a blacklist service were found
    if (await this.tokenService.isLocked(token) === true) {
      throw new UnauthorizedException();
    }

    // attach the auth context to the request
    req.jwt = {
      token,
      payload,
    };

    return true;
  }
}
