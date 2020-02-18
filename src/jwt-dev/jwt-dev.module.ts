import { getTokenByBearerHeader, getTokenByCookie, JwtModule } from '@nestjs-mods/jwt';
import { Module } from '@nestjs/common';
import { JwtDevController } from './jwt-dev.controller';

@Module({
  imports: [
    JwtModule.forRoot({
      secret: 'super-secret-phrase',
      defaultSignOptions: {
        expiresIn: '7 days',
        algorithm: 'HS512',
      },
      tokenResolver: [
        getTokenByCookie('user'),
        getTokenByBearerHeader,
      ],
    }),
  ],
  controllers: [JwtDevController],
})
export class JwtDevModule { }
