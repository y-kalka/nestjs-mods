import { RedisOptions } from 'ioredis';

export interface RateLimiterConfig {
  prefix?: string;
  defaults: {
    ttl: number;
    max: number;
  };
  redis?: RedisOptions;
}
