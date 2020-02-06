import { AuthModule, extractByBearerHeader, extractTokenByCookie } from '@bexxx/auth';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule.forRoot({
      jwtSecret: 'super-secret-phrase',
      defaultJwtSignOptions: {
        expiresIn: '7 days',
        algorithm: 'HS512',
      },
      tokenExtractors: [
        extractTokenByCookie('user'),
        extractByBearerHeader,
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
