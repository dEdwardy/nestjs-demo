import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategy/jwt-strategy';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports:[
    forwardRef(() => UserModule,),
    JwtModule.register({
      secretOrPrivateKey:'qHqPHVPasjfHDCrcX7Ao7x5O5W098RU3i6lloVgWZFY=*',
      signOptions: {
        expiresIn: '12h'
      }
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    CacheModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports:[
    PassportModule
  ]
})
export class AuthModule {}
