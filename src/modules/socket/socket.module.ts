import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { SocketGateway } from './socket.gateway';
import { UserModule } from '../user/user.module';

@Module({
  imports:[UserModule],
  controllers: [SocketController],
  providers: [SocketGateway]
})
export class SocketModule {}
