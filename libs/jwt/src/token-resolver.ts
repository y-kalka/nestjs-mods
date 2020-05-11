export function getTokenByBearerHeader() {
  return (req: any): string => {
    return req.headers.authorization?.replace('Bearer ', '');
  };
}

export function getTokenByCookie(cookieName: string) {
  return (req: any): string => {

    // check that cookies is definied
    if (!req.cookies) {
      throw Error('Cookies property not found. Please ensure that "cookie-parser" is installed');
    }

    return req.cookies[cookieName] as string;
  };
}

export function getTokenByQuery(name: string) {
  return (req: any): string => {
    return req.query[name];
  };
}
