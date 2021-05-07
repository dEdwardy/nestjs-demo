import {  Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { RedisModule } from 'nestjs-redis';
import { CacheModule } from '../cache/cache.module'

@Module({
  imports:[
    RedisModule,
    CacheModule
  ],
  controllers: [ChatController],
  providers: [ChatGateway],
})
export class ChatModule {}
