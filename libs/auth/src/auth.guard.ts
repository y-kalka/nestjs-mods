import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
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

    req = context.switchToHttp().getRequest();

    token = this.extractToken(req);
    Logger.debug(`Found token ${token}`, 'AuthModule', false);

    // if no token was found and it is a public route let the user pass
    if (!token && authType === AuthType.public) {
      return true;
    }

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
    let token: string;

    if (this.config.extractToken) {
      // use custom function to extract the token from the request
      token = this.config.extractToken(req);
    } else {
      // otherwise use default bearer header
      if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
      }
    }

    return token;
  }
}
