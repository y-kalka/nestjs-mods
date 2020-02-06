import { Request } from 'express';

export function extractTokenByCookie(cookieName: string) {
    return (req: Request) => {

        // check that cookies is definied
        if (!req.cookies) {
            return;
        }

        return req.cookies[cookieName];
    };
}
