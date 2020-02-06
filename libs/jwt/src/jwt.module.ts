import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JWT_CONFIG } from './jwt-config.constant';
import { JwtModuleConfig } from './jwt-module-config.interface';
import { JwtGuard } from './jwt.guard';
import { TokenService } from './token.service';

@Global()
@Module({
  providers: [TokenService],
  exports: [TokenService],
})
export class JwtModule {
  static forRoot(options: JwtModuleConfig): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtGuard,
        },
        {
          provide: JWT_CONFIG,
          useValue: options,
        },
      ],
    };
  }
}
