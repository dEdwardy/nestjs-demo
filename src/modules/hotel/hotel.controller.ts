import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { HotelOptions } from './hotel.dto';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';

@ApiUseTags('Hotel')
@Controller('hotel')
@UseGuards(AuthGuard('jwt'))
// @Throttle(60, 60)
export class HotelController {
  constructor(private readonly hotelService: HotelService) { }
  @Get()
  @ApiOperation({ title: '查询酒店' })
  async getHotelInfo (
    @Query() options: HotelOptions = {
      curPage: 1,
      pageNum: 10,
    },
  ) {
    options.curPage = Number(options?.curPage ?? 1)
    options.pageNum = Number(options?.pageNum ?? 10)
    const [data, total] = await this.hotelService.getHotelInfo(options);
    return {
      data,
      curPage: options.curPage,
      pageNum: (data as any).length,
      total
    }
  }
  @Post()
  @ApiOperation({ title: '新增酒店' })
  async addHotel (@Body() data) {
    return this.hotelService.store(data);
  }
}
