import { Module } from '@nestjs/common';
import { getTokenByBearerHeader, getTokenByCookie, JwtModule } from 'libs/jwt/src';
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
  providers: [AppService],
})
export class AppModule { }
