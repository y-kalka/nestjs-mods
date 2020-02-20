import { RedisOptions } from 'ioredis';

export interface RateLimiterConfig {
  prefix?: string;
  defaults?: {
    windowMs?: number;
    max?: number;
    createKey?: (req: any) => string;
    skipSuccessfull?: boolean;
    skipFailed?: boolean;
  };
  redis?: RedisOptions;
}
