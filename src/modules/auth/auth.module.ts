import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategy/jwt-strategy';

@Module({
  imports:[
    UserModule,
    JwtModule.register({
      secretOrPrivateKey:'qHqPHVPasjfHDCrcX7Ao7x5O5W098RU3i6lloVgWZFY=*',
      signOptions: {
        expiresIn: '12h'
      }
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
