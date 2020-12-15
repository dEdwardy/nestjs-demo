import { Injectable, UnauthorizedException} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt'
import { JwtPayload } from '../auth.interface'
import { UserService } from '../../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly userService:UserService
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:'qHqPHVPasjfHDCrcX7Ao7x5O5W098RU3i6lloVgWZFY=*'
        })
    }
    async validate(payload:JwtPayload, done:VerifiedCallback){
        // console.log(payload)
        const { username } = payload;
        const entity = await this.userService.findByName(username);
        if(!entity){
            done(new UnauthorizedException('未找到用户'))
        }
        //相当于  return entity
        done(null, entity)
    }
}