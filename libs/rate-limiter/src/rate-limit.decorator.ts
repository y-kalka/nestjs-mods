import { SetMetadata } from '@nestjs/common';
import { RateLimiterConfig } from './rate-limiter-config.interface';

export const RateLimit = (config: Partial<RateLimiterConfig>) => SetMetadata('rate-limit', config);
