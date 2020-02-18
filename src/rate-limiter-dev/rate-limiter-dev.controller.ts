import { RateLimit } from '@nestjs-mods/rate-limiter';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class RateLimiterDevController {

  @Get('limit/100')
  @RateLimit({
    ttl: 200000,
    max: 5,
  })
  getLimit100() {
    return 'ok';
  }

}
