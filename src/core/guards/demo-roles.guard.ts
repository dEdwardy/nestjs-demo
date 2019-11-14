import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class DemoRolesGuard implements CanActivate {
  constructor(
    private readonly reflector:Reflector
  ){ }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string []>('roles',context.getHandler());
    // console.log(roles)
    // console.log('I m a guard2')
    if(!roles){
      return true
    }
    const req = context.switchToHttp().getRequest();
    const { user } = req;
    const hasRole = () => user.roles.some(role => roles.includes(role))
    // console.log(!!user)
    // console.log(!!user.roles)
    // console.log(!!hasRole())
    return user && user.roles && hasRole();
  }
}
