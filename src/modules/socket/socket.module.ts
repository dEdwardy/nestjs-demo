import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { SocketGateway } from './socket.gateway';
import { UserModule } from '../user/user.module';
import { RedisModule } from 'nestjs-redis';
import { FriendModule } from '../friend/friend.module';

@Module({
  imports:[
    FriendModule,
    UserModule
  ],
  controllers: [SocketController],
  providers: [SocketGateway],
})
export class SocketModule {}
