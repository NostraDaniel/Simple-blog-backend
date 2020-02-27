import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { BaseException} from '../exceptions/base.exception';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    response
    .status(exception.status)
      .json({
        statusCode: exception.status,
        timestamp: new Date(),
        path: request.url,
        method: request.method,
        message: exception.message['message'],
        additional: 'tralala'
      });
  }
}