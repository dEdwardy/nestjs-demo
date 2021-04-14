import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Room]),
    HotelModule
  ],
  providers: [RoomService],
  controllers: [RoomController],
  exports:[RoomService]
})
export class RoomModule {}
