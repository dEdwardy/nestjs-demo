import { Module, forwardRef } from '@nestjs/common';
import { FriendGateway } from './friend.gateway';
import { FriendController } from './friend.controller';
import { RedisModule } from 'nestjs-redis'
import { UserModule } from '../user/user.module';
import { FriendService } from './friend.service';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports:[
    RedisModule.register({
      host:'127.0.0.1',
      port:6379,
      db:0,
      password:'root'
    }),
    AuthModule,
    forwardRef(() => UserModule),

  ],
  providers: [FriendGateway, FriendService],
  controllers: [FriendController]
})
export class FriendModule {}
