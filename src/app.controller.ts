import { Auth, PublicRoute, TokenService } from '@bexxx/auth';
import { Controller, Delete, Get, Post } from '@nestjs/common';
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
  @PublicRoute()
  async login() {
    const token = await this.tokenService.createToken({ role: 'admin' });
    return token;
  }

  @Delete('login')
  async logout(@Auth() auth: any) {
    return auth;
  }
}
