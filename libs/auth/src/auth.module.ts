import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AUTH_CONFIG } from './auth-config.constant';
import { AuthModuleConfig } from './auth-module-config.interface';
import { AuthGuard } from './auth.guard';
import { TokenService } from './token.service';

@Module({
  providers: [TokenService],
  exports: [TokenService],
})
export class AuthModule {
  static forRoot(options: AuthModuleConfig): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: AUTH_CONFIG,
          useValue: options,
        },
      ],
    };
  }
}
