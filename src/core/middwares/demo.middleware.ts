import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class DemoMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if(req.header['x-token']==='secret'){
      req.user = {
        roles: [
          'member'
        ]
      }
    }else{
      req.user = {
        roles: [
          'guest'
        ]
      }
    }
    next();
  }
}
