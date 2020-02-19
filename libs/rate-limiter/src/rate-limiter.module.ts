import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Redis from 'ioredis';
import { RateLimiterConfig } from './rate-limiter-config.interface';
import { RATE_LIMITER_DEFAULT_CONFIG } from './rate-limiter-default-config.constant';
import { RateLimiterInterceptor } from './rate-limiter.interceptor';

const defaults: RateLimiterConfig = {
  prefix: '@nestjs-mods/rate-limiter:',
  // @ts-ignore
  defaults: {
    extend: false,
  },
};

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimiterInterceptor,
    },
    {
      provide: RATE_LIMITER_DEFAULT_CONFIG,
      useValue: defaults,
    },
  ],
})
export class RateLimiterModule {
  static forRoot(options: RateLimiterConfig): DynamicModule {

    return {
      module: RateLimiterModule,
      providers: [
        {
          provide: RATE_LIMITER_DEFAULT_CONFIG,
          useValue: { ...defaults, ...options },
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: new Redis(options.redis),
        },
      ],
    };
  }
}
