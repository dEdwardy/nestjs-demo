import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus, HttpCode } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

export interface Response<T> {
  data: T,
  statusCode: HttpStatus
}


@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    return next
      .handle()
      .pipe(
        map(data => ({ data: data ? data:null ,status:200 }))
      )
  }
}
