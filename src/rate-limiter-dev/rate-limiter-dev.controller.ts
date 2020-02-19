import { RateLimit } from '@nestjs-mods/rate-limiter';
import { Controller, Get } from '@nestjs/common';

const TTL = 1 * 60 * 1000;  // 1 Minute

@Controller()
export class RateLimiterDevController {

  @Get('limit')
  getLimit() {
    return 'ok';
  }

  @Get('limit/5')
  @RateLimit({
    ttl: TTL,
    max: 5,
  })
  getLimit5() {
    return 'ok';
  }

    return 'ok';
  }

  @Get('limit/100')
  @RateLimit({
    ttl: TTL,
    max: 100,
  })
  getLimit100() {
    return 'ok';
  }
}
