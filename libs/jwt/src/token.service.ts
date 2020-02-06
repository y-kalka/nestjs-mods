import { Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { JWT_CONFIG } from './jwt-config.constant';
import { JwtModuleConfig } from './jwt-module-config.interface';

@Injectable()
export class TokenService<Payload = any> {

  constructor(
    @Inject(JWT_CONFIG) private readonly config: JwtModuleConfig,
  ) { }

  public async createToken(payload: Payload, signOptions?: SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        payload as any,
        this.config.secret,
        signOptions || this.config.defaultSignOptions,
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
        this.config.secret,
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
