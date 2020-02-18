export interface RateLimiterConfig {
  ttl: number;
  max: number;
  createKey?: (req: any) => string;
  skipSuccessfull?: boolean;
}
