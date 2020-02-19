import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Redis } from 'ioredis';
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
    const limiterKey = this.getKey(context, conf);
    const redisItem = await this.redis.get(limiterKey).then(res => JSON.parse(res));
    const item: StoreItem = redisItem || {
      r: conf.merged.defaults.max,
      ea: Date.now() + conf.merged.defaults.ttl,
    };
    const expiresInSeconds = Math.round((item.ea - Date.now()) / 1000);

    // TODO: Remove
    console.log('Expires in %s seconds', expiresInSeconds);

    // attach rate limiting headers to the response
    this.attachRateLimitHeaders(context, conf.merged.defaults.max, item, expiresInSeconds);

    // check
    if (item.r === 0) {
      throw new TooManyRequestsExeception();
    }

    // update attempts
    item.r -= 1;
    await this.redis.set(limiterKey, JSON.stringify(item), 'ex', expiresInSeconds);

    return next.handle();
  }

  private getKey(context: ExecutionContext, conf: RateLimitConfig): string {
    const req: Request = context.switchToHttp().getRequest();
    let key = conf.global.prefix;

    // add ip as key
    key += req.ip;

    return key;
  }

  private getRouteConf(context: ExecutionContext): RateLimitConfig {
    const global = this.config;
    const route = this.reflector.get<RateLimiterConfig>('rate-limit', context.getHandler());

    return {
      global,
      route,
      merged: { ...global, ...route },
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
