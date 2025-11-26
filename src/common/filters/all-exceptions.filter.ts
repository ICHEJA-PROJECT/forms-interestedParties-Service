import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { envs } from '../../config/configuration';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Error interno del servidor';

    // Sanitizar datos sensibles
    const sanitizedUrl = this.sanitizeUrl(request.url);

    // Log del error sin exponer información sensible
    const errorLog = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: sanitizedUrl,
      method: request.method,
      message: typeof message === 'object' ? JSON.stringify(message) : message,
    };

    // Log diferentes niveles según el tipo de error
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${sanitizedUrl} - ${status}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    } else if (status === 401 || status === 403) {
      this.logger.warn(`Intento de acceso no autorizado: ${request.method} ${sanitizedUrl}`);
    } else {
      this.logger.warn(`${request.method} ${sanitizedUrl} - ${status}`);
    }

    // Respuesta al cliente (sin exponer stack traces en producción)
    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: sanitizedUrl,
      message: typeof message === 'object' ? message : { message },
    };

    // Solo agregar stack trace en desarrollo
    if (envs.nodeEnv === 'development' && exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

  private sanitizeUrl(url: string): string {
    // Remover tokens y otros datos sensibles de la URL
    return url.replace(/([?&])(token|password|secret)=[^&]*/gi, '$1$2=***');
  }
}
