// import { getTokenByBearerHeader, getTokenByCookie, JwtModule } from '@nestjs-mods/jwt';
import { Module } from '@nestjs/common';
// import { JwtDevModule } from './jwt-dev/jwt-dev.module';
import { RateLimiterDevModule } from './rate-limiter-dev/rate-limiter-dev.module';

@Module({
  imports: [
    // JwtDevModule,
    RateLimiterDevModule,
  ],
})
export class AppModule { }
