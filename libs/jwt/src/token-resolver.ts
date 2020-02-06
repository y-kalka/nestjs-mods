import { Request } from 'express';

export function getTokenByBearerHeader() {
  return (req: Request) => {
    return req.headers.authorization?.replace('Bearer ', '');
  };
}

export function getTokenByCookie(cookieName: string) {
  return (req: Request) => {

    // check that cookies is definied
    if (!req.cookies) {
      throw Error('Cookies property not found. Please ensure that "cookie-parser" is installed');
    }

    return req.cookies[cookieName];
  };
}
