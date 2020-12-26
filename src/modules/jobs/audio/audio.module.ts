import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AudioController } from './audio.controller';
import { AudioProcessor } from './audio.processor';

@Module({
  imports:[
    BullModule.registerQueueAsync({
      name:'audio',
      useFactory: (config:ConfigService) => ({
        redis:{
          host:config.get('HOST'),
          port:config.get('REDIS_PORT'),
          password:config.get('PASSWORD')
        }
      }),
      inject:[ConfigService]
    })
  ],
  controllers: [AudioController],
  providers:[AudioProcessor]
})
export class AudioModule {}
