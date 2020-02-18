import { RateLimiterModule } from '@nestjs-mods/rate-limiter';
import { Module } from '@nestjs/common';
import { RateLimiterDevController } from './rate-limiter-dev.controller';

@Module({
  imports: [
    RateLimiterModule,
  ],
  controllers: [RateLimiterDevController],
})
export class RateLimiterDevModule { }
