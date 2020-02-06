import { Request } from 'express';
import { SignOptions } from 'jsonwebtoken';

export interface AuthModuleConfig {
  defaultJwtSignOptions?: SignOptions;
  jwtSecret: string;
  extractToken?: (request: Request) => string;
}
