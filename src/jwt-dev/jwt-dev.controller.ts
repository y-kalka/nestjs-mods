import { Public, Token, TokenService } from '@nestjs-mods/jwt';
import { Controller, Delete, Post } from '@nestjs/common';

@Controller()
export class JwtDevController {

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
}
