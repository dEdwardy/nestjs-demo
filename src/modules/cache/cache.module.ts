import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis'
import { CacheService } from './cache.service';

@Module({
  providers: [CacheService],
  imports:[
    RedisModule
  ],
  exports:[CacheService]
})
export class CacheModule {}
