import { RedisOptions } from 'ioredis';

export interface RateLimiterConfig {
  prefix?: string;
  defaults: {
    windowMs: number;
    max: number;
    createKey?: (req: any) => string;
  };
  redis: RedisOptions;
}
