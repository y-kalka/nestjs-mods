import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Redis } from 'ioredis';
import { tap } from 'rxjs/operators';
import { mergeConfigs } from './merge-config';
import { RateLimiterConfig } from './rate-limiter-config.interface';
import { RATE_LIMITER_DEFAULT_CONFIG } from './rate-limiter-default-config.constant';
import { TooManyRequestsExeception } from './too-many-requests.execption';

interface StoreItem {
  r: number;   // remaining budget
  ea: number;  // expiresAt
}

interface RateLimitConfig {
  global: RateLimiterConfig;
  route: RateLimiterConfig;
  merged: RateLimiterConfig;
}
@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {

  constructor(
    private readonly reflector: Reflector,
    @Inject(RATE_LIMITER_DEFAULT_CONFIG) private config: RateLimiterConfig,
    @Inject('REDIS_CLIENT') private redis: Redis,
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const conf = this.getRouteConf(context);
    const key = this.createKey(context, conf);

    // check if rate limiting is required
    if (!conf.merged.defaults.max || !conf.merged.defaults.windowMs) {
      return next.handle();
    }

    // laod item and calculate the expire date
    const item = await this.getItem(key, conf);

    // reduce the budget
    item.r -= 1;

    // attach rate limiting headers to the response
    this.attachRateLimitHeaders(context, conf.merged.defaults.max, item, item.ea);

    // check
    if (item.r === 0) {
      throw new TooManyRequestsExeception();
    }

    return next.handle().pipe(
      tap(
        () => {
          // dont update if skipSuccessfull is active
          if (conf.merged.defaults.skipSuccessfull === true) {
            return;
          }

          this.updateItem(key, item);
        },
        () => {

          // dont update if skipFailed is active
          if (conf.merged.defaults.skipFailed === true) {
            return;
          }

          this.updateItem(key, item);
        },
      ));
  }

  /**
   * @description
   * Generates the key for key value store
   */
  private createKey(context: ExecutionContext, conf: RateLimitConfig): string {
    const key: string[] = [conf.global.prefix];
    const scoped = !!conf.route;
    const req: Request = context.switchToHttp().getRequest();

    if (conf.route?.defaults?.createKey) {
      // if a custom key is generated for the route use only this key
      key.push(conf.route.defaults.createKey(req));
    } else {

      // if settings are made throug the decorator to a route don't use the global limit budget
      if (scoped) {
        key.push(req.url);
      }

      key.push(conf.global.defaults.createKey(req));
    }

    return key.join(':');
  }

  private async getItem(key: string, conf: RateLimitConfig): Promise<StoreItem> {
    const redisItem = await this.redis.get(key).then(res => JSON.parse(res));

    // if a item was found in redis
    if (redisItem) {
      return redisItem;
    }

    // otherwise generate a default item
    return {
      r: conf.merged.defaults.max,
      ea: Date.now() + conf.merged.defaults.windowMs,
    };
  }

  private async updateItem(key: string, item: StoreItem): Promise<void> {
    const expiresInSeconds = Math.round((item.ea - Date.now()) / 1000);

    console.log('Update redis item and expires in %i seconds', expiresInSeconds);

    await this.redis.set(key, JSON.stringify(item), 'ex', expiresInSeconds);
  }

  private getRouteConf(context: ExecutionContext): RateLimitConfig {
    const global = this.config;
    const route = this.reflector.get<RateLimiterConfig>('rate-limit', context.getHandler());

    return {
      global,
      route,
      merged: mergeConfigs(global, route),
    };
  }

  /**
   * @description
   * Attach header information
   */
  private attachRateLimitHeaders(context: ExecutionContext, limit: number, item: StoreItem, expiresAt: number): void {
    const res = context.switchToHttp().getResponse();

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', item.r);

    if (item.r === 0 && expiresAt) {
      res.setHeader('Retry-after', new Date(expiresAt).toUTCString());
    }
  }
}
