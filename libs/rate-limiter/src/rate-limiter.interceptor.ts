import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RateLimiterConfig } from './rate-limiter-config.interface';
import { RATE_LIMITER_DEFAULT_CONFIG } from './rate-limiter-default-config.constant';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {

  constructor(
    private readonly reflector: Reflector,
    @Inject(RATE_LIMITER_DEFAULT_CONFIG) private defaultConf: RateLimiterConfig,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rateLimitConf = this.getRouteConf(context);

    // TODO: Check remaining limit

    // attach rate limiting headers
    this.attachRateLimitHeaders(context, 10, 2);

    return next.handle();
  }

  private getRouteConf(context: ExecutionContext): RateLimiterConfig {
    const routeConfig = this.reflector.get<RateLimiterConfig>('rate-limit', context.getHandler());

    // return if no merge of the configs is required
    if (!routeConfig) {
      return this.defaultConf;
    }

    return {
      ...this.defaultConf,
      ...routeConfig,
    };
  }

  private attachRateLimitHeaders(context: any, limit: number, remaining: number, retryAfter?: number): void {
    const res = context.switchToHttp().getResponse();
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);

    if (retryAfter) {
      res.setHeader('Retry-after', retryAfter);
    }
  }
}
