import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Redis from 'ioredis';
import { mergeConfigs } from './merge-config';
import { RateLimiterConfig } from './rate-limiter-config.interface';
import { RATE_LIMITER_DEFAULT_CONFIG } from './rate-limiter-default-config.constant';
import { RateLimiterInterceptor } from './rate-limiter.interceptor';

const defaults: RateLimiterConfig = {
  prefix: '@nestjs-mods/rate-limiter',
  defaults: {
    max: 0,
    windowMs: 0,
    createKey: (req) => req.ip,
    skipSuccessfull: false,
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
          useValue: mergeConfigs(defaults, options),
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: new Redis(options.redis),
        },
      ],
    };
  }
}
