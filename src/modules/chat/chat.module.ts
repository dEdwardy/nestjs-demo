import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports:[
    RedisModule
  ],
  controllers: [ChatController],
  providers: [ChatGateway],
})
export class ChatModule {}
