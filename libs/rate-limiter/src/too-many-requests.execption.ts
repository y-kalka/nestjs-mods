import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestsExeception extends HttpException {
  constructor(message?: string, error = 'Too many requests') {
    super(HttpException.createBody(message, error, HttpStatus.TOO_MANY_REQUESTS), HttpStatus.TOO_MANY_REQUESTS);
  }
}
