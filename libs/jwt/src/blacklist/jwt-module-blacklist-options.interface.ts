import { DynamicModule } from '@nestjs/common';

export interface JwtModuleBlacklistOptions {
  imports?: DynamicModule[];
  blacklistStore?: any;
}
