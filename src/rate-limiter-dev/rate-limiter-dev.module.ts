import { RateLimiterModule } from '@nestjs-mods/rate-limiter';
import { Module } from '@nestjs/common';
import { RateLimiterDevController } from './rate-limiter-dev.controller';

@Module({
  imports: [
    RateLimiterModule.forRoot({
      defaults: {
        windowMs: 60 * 60 * 1000,
        max: 1000,
      },
      redis: {
        port: 6379,
      },
    }),
  ],
  controllers: [RateLimiterDevController],
})
export class RateLimiterDevModule { }
