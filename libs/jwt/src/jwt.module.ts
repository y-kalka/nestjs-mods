import { DynamicModule, Global, Module } from '@nestjs/common';
import { JWT_BLACKLIST_STORE_TOKEN } from './blacklist/blacklist-store-token.constant';
import { JwtModuleBlacklistOptions } from './blacklist/jwt-module-blacklist-options.interface';
import { MemoryStore } from './blacklist/memory-store';
import { JWT_CONFIG } from './jwt-config.constant';
import { JwtModuleConfig } from './jwt-module-config.interface';
import { TokenService } from './token.service';

@Global()
@Module({
  providers: [
    TokenService,
  ],
  exports: [
    TokenService,
  ],
})
export class JwtModule {
  static forRoot(options: JwtModuleConfig, blacklist: JwtModuleBlacklistOptions = { blacklistStore: MemoryStore }): DynamicModule {
    return {
      module: JwtModule,
      imports: blacklist.imports || [],
      providers: [
        {
          provide: JWT_CONFIG,
          useValue: options,
        },
        {
          provide: JWT_BLACKLIST_STORE_TOKEN,
          useClass: blacklist.blacklistStore,
        },
      ],
    };
  }
}
