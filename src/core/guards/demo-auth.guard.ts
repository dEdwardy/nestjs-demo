import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DemoAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const  req = context.switchToHttp().getRequest();
    req.user = {
      roles:['guests']
    }
    console.log('I m a guard 1')
    return true;
  }
}
