import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Redis from 'ioredis';
import { RateLimiterConfig } from './rate-limiter-config.interface';
import { RATE_LIMITER_DEFAULT_CONFIG } from './rate-limiter-default-config.constant';
import { RateLimiterInterceptor } from './rate-limiter.interceptor';

const defaults: RateLimiterConfig = {
  prefix: '@nestjs-mods/rate-limiter',
  // @ts-ignore
  defaults: {
    createKey: (req) => req.ip,
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

    // merge the default options with the custom options
    const mergedOptions = { ...defaults, ...options };
    mergedOptions.defaults = { ...defaults.defaults, ...options.defaults };

    return {
      module: RateLimiterModule,
      providers: [
        {
          provide: RATE_LIMITER_DEFAULT_CONFIG,
          useValue: mergedOptions,
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: new Redis(mergedOptions.redis),
        },
      ],
    };
  }
}
