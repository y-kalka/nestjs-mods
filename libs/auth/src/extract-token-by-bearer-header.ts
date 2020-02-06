import { Request } from 'express';

export function extractByBearerHeader(req: Request) {
    return req.headers.authorization?.replace('Bearer ', '');
}
