import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AUTH_CONFIG } from './auth-config.constant';
import { AuthModuleConfig } from './auth-module-config.interface';
import { AuthType } from './auth-type.enum';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTH_CONFIG) private readonly config: AuthModuleConfig,
    private authService: AuthService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authType = this.reflector.get<AuthType>('auth-type', context.getHandler());
    let req: Request & { auth: any; };
    let token: string;

    // skip token validation on public routes
    if (authType === AuthType.public) {
      Logger.debug(`Public route skipt token validation`, 'Authentication', false);
      return true;
    }

    req = context.switchToHttp().getRequest();
    token = this.extractToken(req);

    // if no token was
    if (!token) {
      Logger.debug(`No JWT found denie access`, 'Authentication', false);
      throw new UnauthorizedException();
    }

    Logger.debug(`JWT token found "${token}"`, 'Authentication', false);

    try {
      const payload = await this.authService.verifyToken(token);

      // attach user data to request
      req.auth = {
        token,
        payload,
      };
      return true;
    } catch (err) {
      return false;
    }
  }

  private extractToken(req: Request): string {
    for (const extractor of this.config.tokenExtractors) {
      const token = extractor(req);

      // return the first token that was found
      if (token) {
        return token;
      }
    }
  }
}
