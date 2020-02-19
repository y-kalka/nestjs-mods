import { RateLimiterModule } from '@nestjs-mods/rate-limiter';
import { Module } from '@nestjs/common';
import { RateLimiterDevController } from './rate-limiter-dev.controller';

@Module({
  imports: [
    RateLimiterModule.forRoot({
      defaults: {
        ttl: 60 * 60 * 1000,
        max: 1000,
      },
    }),
  ],
  controllers: [RateLimiterDevController],
})
export class RateLimiterDevModule { }
