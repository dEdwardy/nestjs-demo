import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis'
import { CacheService } from './cache.service';

const  options = {
  port: 6379,
  host: 'localhost',
  db: 1
}
@Module({
  providers: [CacheService],
  imports:[
    RedisModule.register(options)
  ],
  exports:[CacheService]
})
export class CacheModule {}
