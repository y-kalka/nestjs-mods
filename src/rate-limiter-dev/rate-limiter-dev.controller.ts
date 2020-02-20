import { RateLimit } from '@nestjs-mods/rate-limiter';
import { BadRequestException, Controller, Get } from '@nestjs/common';

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

  @Get('limit/login')
  @RateLimit({
    windowMs: TTL,
    max: 5,
    skipSuccessfull: true,
  })
  getLogin() {
    return 'ok';
  }

  @Get('limit/5')
  @RateLimit({
    windowMs: TTL,
    max: 5,
    skipSuccessfull: false,
    skipFailed: false,
  })
  getLimit5() {
    throw new BadRequestException('moin');
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
