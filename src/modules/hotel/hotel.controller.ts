import { Body, Controller, Get, Post } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';

@ApiUseTags('Hotel')
@Controller('hotel')
export class HotelController {
  constructor(
    private readonly hotelService: HotelService
  ) { }
  @Get()
  @ApiOperation({ title: '查询酒店' })
  async getHotelInfo () {
    return this.hotelService.getHotelInfo()
  }
  @Post()
  @ApiOperation({ title: '新增酒店' })
  async addHotel (@Body() data) {
    return this.hotelService.store(data)
  }
}
