import { RateLimit } from '@nestjs-mods/rate-limiter';
import { Controller, Get } from '@nestjs/common';

const TTL = 1 * 60 * 1000;  // 1 Minute

@Controller()
export class RateLimiterDevController {

  @Get('limit/global1')
  getLimit() {
    return 'ok';
  }

  @Get('limit/global2')
  getLimit2() {
    return 'ok';
  }

  @Get('limit/5')
  @RateLimit({
    windowMs: TTL,
    max: 5,
    skipSuccessfull: true,
  })
  getLimit5() {
    return 'ok';
  }

  @Get('limit/100')
  @RateLimit({
    windowMs: TTL,
    max: 100,
  })
  getLimit100() {
    return 'ok';
  }
}
