import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Redis } from 'ioredis';
import { mergeConfigs } from './merge-config';
import { RateLimiterConfig } from './rate-limiter-config.interface';
import { RATE_LIMITER_DEFAULT_CONFIG } from './rate-limiter-default-config.constant';
import { TooManyRequestsExeception } from './too-many-requests.execption';

interface StoreItem {
  r: number;   // remaining
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

    // if this route has no limit exit here
    if (!conf.merged.defaults.max || !conf.merged.defaults.windowMs) {
      return next.handle();
    }

    // laod item and calculate the expire date
    const item = await this.getItem(key, conf);
    const expiresInSeconds = Math.round((item.ea - Date.now()) / 1000);

    // TODO: Remove
    console.log('Expires in %s seconds', expiresInSeconds);
    console.log('Key', key);

    // attach rate limiting headers to the response
    this.attachRateLimitHeaders(context, conf.merged.defaults.max, item, expiresInSeconds);

    // check
    if (item.r === 0) {
      throw new TooManyRequestsExeception();
    }

    // do not reduce the budget for this request
    if (conf.merged.defaults.skipSuccessfull === false) {
      item.r -= 1;
    }

    // save the updated item to redis
    await this.redis.set(key, JSON.stringify(item), 'ex', expiresInSeconds);

    return next.handle();
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
  private attachRateLimitHeaders(context: ExecutionContext, limit: number, item: StoreItem, expiresInSeconds: number): void {
    const res = context.switchToHttp().getResponse();

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', item.r);

    if (item.r === 0 && expiresInSeconds > 0) {
      res.setHeader('Retry-after', expiresInSeconds);
    }
  }
}
