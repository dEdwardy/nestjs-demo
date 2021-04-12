import { Injectable, UnauthorizedException} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt'
import { JwtPayload } from '../auth.interface'
import { UserService } from '../../user/user.service'
import { CacheService } from '../../cache/cache.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly userService:UserService,
        private readonly cacheService:CacheService
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:'qHqPHVPasjfHDCrcX7Ao7x5O5W098RU3i6lloVgWZFY=*'
        })
    }
    async validate(payload:JwtPayload, done:VerifiedCallback){
        // console.log(payload)
        const { username } = payload;
        //通过帐号密码登录 pc
        const entity = await this.userService.findByName(username);
        if(!entity){
          //通过电话 邮箱 验证码登录 app h5
          const info = await this.cacheService.get(payload.email)
          if(info)done(null, info)
          done(new UnauthorizedException('未找到用户'))
        }
        //相当于  return entity
        done(null, entity)
    }
}