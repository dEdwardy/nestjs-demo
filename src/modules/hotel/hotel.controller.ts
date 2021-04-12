import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { HotelOptions } from './hotel.dto';

@ApiUseTags('Hotel')
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}
  @Get()
  @ApiOperation({ title: '查询酒店' })
  async getHotelInfo(
    @Query() options: HotelOptions = {
      curPage: 1,
      pageNum: 10,
    },
  ) {
    return this.hotelService.getHotelInfo(options);
  }
  @Post()
  @ApiOperation({ title: '新增酒店' })
  async addHotel(@Body() data) {
    return this.hotelService.store(data);
  }
}
