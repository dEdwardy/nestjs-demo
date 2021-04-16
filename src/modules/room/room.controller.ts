import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { roomDto } from './room.dto';
import { HotelService } from '../hotel/hotel.service';
import { AuthGuard } from '@nestjs/passport';

@ApiUseTags('Room')
@Controller('room')
@UseGuards(AuthGuard('jwt'))
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly hotelService: HotelService
  ) { }

  @Get()
  @ApiOperation({ title: '获取酒店下的房间' })
  getRoomByHotelId (@Query() data: roomDto) {
    const hotelInfo = () => this.hotelService.getHotelById(data.hotelId)
    const roomInfos = () => this.roomService.getRoomByHotelId(data.hotelId)
    return Promise.all([hotelInfo(),roomInfos()]).then(([hotel,rooms]) => ({...hotel,roomsInfo:rooms}))
  }
  @Post()
  @ApiOperation({ title: '新增房间' })
  addRoom (@Body() data) {
    return this.roomService.store(data)
  }
}
