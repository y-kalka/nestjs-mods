import { Controller, Delete, Get, Post } from '@nestjs/common';
import { Public, Token, TokenService } from 'libs/jwt/src';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private tokenService: TokenService<{ role: string; }>,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

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
}
