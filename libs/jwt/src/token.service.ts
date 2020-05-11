import { Global, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { decode, sign, SignOptions, verify } from 'jsonwebtoken';
import { JWT_BLACKLIST_STORE_TOKEN } from './blacklist/blacklist-store-token.constant';
import { BlacklistStore } from './blacklist/blacklist-store.interface';
import { JWT_CONFIG } from './jwt-config.constant';
import { JwtModuleConfig } from './jwt-module-config.interface';

@Injectable()
@Global()
export class TokenService<Payload = any> {

  constructor(
    @Inject(JWT_CONFIG) private readonly config: JwtModuleConfig,
    @Inject(JWT_BLACKLIST_STORE_TOKEN) private readonly blacklistStore: BlacklistStore,
  ) { }

  /**
   * @description
   * Create a token with the submited payload
   * @param payload
   * @param signOptions
   */
  public createToken(payload: Payload, signOptions?: SignOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        payload as any,
        this.config.secret,
        { ...this.config.defaultSignOptions, ...signOptions },
        (err, token) => {
          if (err) {
            return reject(err);
          }

          resolve(token);
        },
      );
    });
  }

  /**
   * @description
   * Verify a token and returns the payload if token is valid
   * @param token
   */
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

  public decode(token: string): Payload {
    return decode(token) as any;
  }

  public lock(token: string, expiresAt: Date): void {
    this.blacklistStore.set(token, { token, expiresAt });
  }

  public async isLocked(token: string): Promise<boolean> {
    const item = await this.blacklistStore.get(token);

    // delete token if expired
    if (item && this.isExpired(item.expiresAt)) {
      this.blacklistStore.delete(token);
    }

    return !!item;
  }

  public async cleanBlacklistStorage(): Promise<number> {
    if (typeof this.blacklistStore.getAll !== 'function') {
      throw Error('Blacklist store has no getAll() function');
    }

    const items = await this.blacklistStore.getAll();
    let cleanCount = 0;

    for (const item of items) {
      if (this.isExpired(item.expiresAt) === true) {
        this.blacklistStore.delete(item.token);
        cleanCount += 1;
      }
    }

    return cleanCount;
  }

  public getJwtTokenFromHttpRequest(req: Request): string {
    for (const resolver of this.config.tokenResolver) {
      const token = resolver(req);

      // return the first token that was found
      if (token) {
        return token;
      }
    }
  }

  private isExpired(date: Date): boolean {
    return date.getTime() <= Date.now();
  }
}
