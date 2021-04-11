import { HttpModule, Module } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { SpiderController } from './spider.controller';

@Module({
  imports:[HttpModule],
  providers: [SpiderService],
  controllers: [SpiderController],
  exports:[SpiderService],
})
export class SpiderModule {}
