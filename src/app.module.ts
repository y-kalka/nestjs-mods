import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { getTokenByBearerHeader, getTokenByCookie, JwtGuard, JwtModule } from 'libs/jwt/src';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtGuard }
  ],
})
export class AppModule { }
