import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      message =
        typeof body === 'object' && 'message' in body
          ? (body as ErrorResponse).message
          : exception.message;
    } else if (this.isRpcError(exception)) {
      const rpc = exception;
      status = rpc.statusCode ?? HttpStatus.BAD_REQUEST;
      message = rpc.message ?? 'Service error';
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled: ${exception.message}`, exception.stack);
    }

    const correlationId = (req['correlationId'] as string) ?? '-';
    this.logger.warn(`${req.method} ${req.url} → ${status} [${correlationId}]`);

    res.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
      correlationId,
    });
  }

  private isRpcError(err: unknown): err is ErrorResponse {
    return typeof err === 'object' && err !== null && 'statusCode' in err;
  }
}
