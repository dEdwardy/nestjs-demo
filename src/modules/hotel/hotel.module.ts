import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelController } from './hotel.controller';
import { Hotel } from './hotel.entity';
import { HotelService } from './hotel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hotel]),
  ],
  controllers: [HotelController],
  providers: [HotelService],
  exports:[HotelService]
})
export class HotelModule { }
