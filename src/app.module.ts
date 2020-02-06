import { AuthModule } from '@bexxx/auth';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const authMod = AuthModule.forRoot({
  jwtSecret: 'super-secret-phrase',
  defaultJwtSignOptions: null,
  extractToken: (req) => req.headers.jwt || req.cookies.jwt,
});

@Module({
  imports: [
    AuthModule.forRoot({
      jwtSecret: 'super-secret-phrase',
      defaultJwtSignOptions: null,
      extractToken: (req) => req.headers.jwt || req.cookies.jwt,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
