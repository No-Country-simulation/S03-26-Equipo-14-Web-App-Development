import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Response } from 'express';
import { Prisma } from '@repo/api';
import { timeStamp } from 'console';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const { code, meta } = exception;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (code) {
      //record not found
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = meta?.modelName
          ? `${meta.modelName} no found`
          : 'Record not found';
        break;
      // unique contraint violation (create o update)
      case 'P2002':
        status = HttpStatus.CONFLICT;
        const target = meta?.target as string[] | undefined;
        const field = target?.[0] || 'field';
        message = `Exist with same field ${field}`;
        break;
      // foreign key constraint
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint failed';
        break;
      //required relation violation
      case 'P2014':
        status = HttpStatus.CONFLICT;
        message =
          'The operation cannot be performed because it violates a required constraint';
        break;
      //value to long
      case 'P2000':
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid value or value too long for one of the fields';
        break;

      // Agregá más códigos según necesites (P2014, P2021, etc.)
      default:
        this.logger.error(
          `Prisma error ${code}: ${exception.message}`,
          exception.stack,
        );
        message = exception.message;
    }

    response.status(status).json({
      success: false,
      message,
      statusCode: status,
      timeStamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
