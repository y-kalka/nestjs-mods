import { Request } from 'express';
import { SignOptions } from 'jsonwebtoken';

export interface AuthModuleConfig {
  defaultJwtSignOptions?: SignOptions;
  jwtSecret: string;
  tokenExtractors: AuthModuleExtractFunction[];
}

export type AuthModuleExtractFunction = (request: Request) => string;
