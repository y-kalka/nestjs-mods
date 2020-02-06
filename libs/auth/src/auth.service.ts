import { Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { AUTH_CONFIG } from './auth-config.constant';
import { AuthModuleConfig } from './auth-module-config.interface';

@Injectable()
export class AuthService<Payload = any> {

  constructor(
    @Inject(AUTH_CONFIG) private readonly config: AuthModuleConfig,
  ) { }

  public async createToken(payload: Payload, signOptions?: SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        payload as any,
        this.config.jwtSecret,
        signOptions || this.config.defaultJwtSignOptions,
        (err, token) => {
          if (err) {
            return reject(err);
          }

          resolve(token);
        },
      );
    });
  }

  public async verifyToken(token: string): Promise<Payload> {
    return new Promise((resolve, reject) => {
      verify(
        token,
        this.config.jwtSecret,
        (err, payload: any) => {
          if (err) {
            return reject(err);
          }

          resolve(payload);
        },
      );
    });
  }

  public async invalidateToken(payload: Payload): Promise<void> {
    // TODO:
    return;
  }
}
