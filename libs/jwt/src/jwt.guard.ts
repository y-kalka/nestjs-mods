import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthType } from './auth-type.enum';
import { JWT_CONFIG } from './jwt-config.constant';
import { JwtModuleConfig } from './jwt-module-config.interface';
import { TokenData } from './token-data.interface';
import { TokenService } from './token.service';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
    @Inject(JWT_CONFIG) private readonly config: JwtModuleConfig,
    private tokenService: TokenService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authType = this.reflector.get<AuthType>('jwt-mode', context.getHandler());
    let req: Request & { jwt: any; };
    let token: string;

    // skip token validation on public routes
    if (authType === AuthType.public) {
      Logger.debug(`Public route skipt token validation`, 'Authentication', false);
      return true;
    }

    req = context.switchToHttp().getRequest();
    token = this.resolveToken(req);

    // if no token was
    if (!token) {
      Logger.debug(`No JWT found denie access`, 'Authentication', false);
      throw new UnauthorizedException();
    }

    Logger.debug(`JWT token found "${token}"`, 'Authentication', false);

    try {
      const payload = await this.tokenService.verifyToken(token);

      const ctx: TokenData = {
        token,
        payload,
      };

      // attach the auth context to the request
      req.jwt = ctx;

      return true;
    } catch (err) {
      return false;
    }
  }

  private resolveToken(req: Request): string {
    for (const resolver of this.config.tokenResolver) {
      const token = resolver(req);

      // return the first token that was found
      if (token) {
        return token;
      }
    }
  }
}
