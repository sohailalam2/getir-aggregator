import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionResponseObject {
  type?: string;
  statusCode?: number;
  message?: string | string[];
  error?: string;
  stack?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Something went wrong, try again later';

    if (typeof exceptionResponse === 'object') {
      const errRes: ExceptionResponseObject = exceptionResponse;

      if (typeof errRes.error === 'string') {
        message = errRes.error;
      }

      if (typeof errRes.message === 'string') {
        message = errRes.message;
      }

      // eslint-disable-next-line no-magic-numbers, @typescript-eslint/no-magic-numbers
      if (Array.isArray(errRes.message)) {
        message = errRes.message[0];
      }
    }

    response.status(status).json({
      code: status,
      msg: message,
      records: null,
    });
  }
}
