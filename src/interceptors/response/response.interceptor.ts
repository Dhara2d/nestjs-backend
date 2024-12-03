import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const httpMethod = request.method;

    return next.handle().pipe(
      map((data) => ({
        status: response.statusCode,
        message: this.getMessageForMethod(httpMethod, response.statusCode),
        data,
      })),
    );
  }

  private getMessageForMethod(method: string, statusCode: number): string {
    const messages: Record<string, Record<number, string>> = {
      GET: {
        200: 'Data Fetched Successfully',
        404: 'Resource Not Found',
      },
      POST: {
        201: 'Resource Created Successfully',
        400: 'Bad Request',
      },
      PUT: {
        200: 'Resource Updated Successfully',
        400: 'Invalid Update Request',
      },
      PATCH: {
        200: 'Partial Update Successful',
        400: 'Invalid Patch Request',
      },
      DELETE: {
        200: 'Resource Deleted Successfully',
        404: 'Resource Not Found for Deletion',
      },
    };

    return messages[method]?.[statusCode] || 'Operation Completed';
  }
}
