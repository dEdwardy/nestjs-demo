import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { roomDto } from './room.dto';

@ApiUseTags('Room')
@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService
  ) { }

  @Get()
  @ApiOperation({ title: '获取酒店下的房间' })
  getRoomByHotelId (@Query() data: roomDto) {
    console.log(data.hotelId)
    return this.roomService.getRoomByHotelId(data.hotelId)
  }
  @Post()
  @ApiOperation({ title: '新增房间' })
  addRoom (@Body() data) {
    return this.roomService.store(data)
  }
}
