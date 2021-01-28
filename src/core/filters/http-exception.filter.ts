import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException )
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception:HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const message = exception.message;
    const status = exception.getStatus();
    res.status(200)
      .json({
        data: {
          status ,
          date: new Date().toLocaleDateString(),
          path: req.url,
          message
        }
      })
  }
}
