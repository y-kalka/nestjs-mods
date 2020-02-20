import { Public, Token, TokenService } from '@nestjs-mods/jwt';
import { RateLimit } from '@nestjs-mods/rate-limiter';
import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller()
export class AppController {

  constructor(
    private tokenService: TokenService<{ role: string; }>,
  ) { }

  @Post('login')
  @Public()
  async login() {
    const token = await this.tokenService.createToken({ role: 'admin' });
    return token;
  }

  @Delete('login')
  async logout(@Token() token: string) {
    return token;
  }

  @Get('limit/100')
  @RateLimit({
    windowMs: 200000,
    max: 5,
  })
  getLimit100() {
    return 'ok';
  }
}
