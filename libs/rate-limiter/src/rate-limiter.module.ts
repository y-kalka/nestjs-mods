import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RateLimiterConfig } from './rate-limiter-config.interface';
import { RATE_LIMITER_DEFAULT_CONFIG } from './rate-limiter-default-config.constant';
import { RateLimiterInterceptor } from './rate-limiter.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimiterInterceptor,
    },
  ],
})
export class RateLimiterModule {
  static forRoot(options: RateLimiterConfig): DynamicModule {
    const defaults: Partial<RateLimiterConfig> = {
      createKey(req) {
        return req.ip;
      },
      skipSuccessfull: false,
    };

    return {
      module: RateLimiterModule,
      providers: [
        {
          provide: RATE_LIMITER_DEFAULT_CONFIG,
          useValue: { ...defaults, ...options },
        }
      ],
    }
  }
}
