import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './auth.dto';
import { JwtPayload } from './auth.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UserService,
        private readonly jwtService: JwtService
    ){ }
    async login(data:LoginDto){
        const { username, password } = data;
        const entity = await this.userService.findByName(username);
        console.log(entity)
        if(!entity){
            throw new UnauthorizedException('用户名不存在');
        }
        if(!(await entity.comparePwd(password))){
            throw new UnauthorizedException('密码不匹配');
        }
        const  { id }  = entity;
        const payload = { id, username}
        const  token = this.signToken(payload);
        console.log(token)
        return {
            ...payload,
            token
        }
    }
    signToken(data: JwtPayload){
        console.log(data)
        return this.jwtService.sign(data);
    }
}
