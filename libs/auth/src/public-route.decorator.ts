import { SetMetadata } from '@nestjs/common';
import { AuthType } from './auth-type.enum';

export const PublicRoute = () => SetMetadata('auth-type', AuthType.public);
