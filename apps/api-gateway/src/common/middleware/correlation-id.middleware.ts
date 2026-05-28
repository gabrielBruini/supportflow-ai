import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

export const CORRELATION_ID_HEADER = 'X-Correlation-ID';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const id =
      (req.headers[CORRELATION_ID_HEADER.toLowerCase()] as string) ??
      randomUUID();
    req['correlationId'] = id;
    res.setHeader(CORRELATION_ID_HEADER, id);
    next();
  }
}
