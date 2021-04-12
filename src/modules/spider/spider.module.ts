import { HttpModule, Module } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { SpiderController } from './spider.controller';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  imports:[HttpModule,HotelModule],
  providers: [SpiderService],
  controllers: [SpiderController],
  exports:[SpiderService],
})
export class SpiderModule {}
