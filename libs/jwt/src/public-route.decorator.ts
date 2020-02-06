import { SetMetadata } from '@nestjs/common';
import { AuthType } from './auth-type.enum';

export const Public = () => SetMetadata('jwt-mode', AuthType.public);
