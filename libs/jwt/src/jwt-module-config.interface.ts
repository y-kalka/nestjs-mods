import { Request } from 'express';
import { SignOptions } from 'jsonwebtoken';

export interface JwtModuleConfig {
  defaultSignOptions?: SignOptions;
  secret: string;
  tokenResolver: JwtExtractFunction[];
}

export type JwtExtractFunction = (request: Request) => string;
