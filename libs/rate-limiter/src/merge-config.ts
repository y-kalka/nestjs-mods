import { RateLimiterConfig } from './rate-limiter-config.interface';

export function mergeConfigs(firstConf: RateLimiterConfig, secondConf: RateLimiterConfig) {
  const merged = { ...firstConf, ...secondConf };
  merged.defaults = { ...firstConf.defaults, ...secondConf.defaults };

  return merged;
}
