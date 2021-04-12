import { Injectable } from '@nestjs/common';
import { Hotel } from './hotel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HotelOptions } from './hotel.dto';
import { Room } from '../room/room.entity';
import { ApiOperation } from '@nestjs/swagger';


// class IHotel {
//   name: string;
//   location: string;
//   desc: string;
//   tags: string;
//   rate: string;
//   img: string;
//   rooms?: Room[];
// }
@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel) private readonly hotelReposity: Repository<Hotel>,
  ) {}
  async getHotelInfo(options: HotelOptions) {
    return await this.hotelReposity.find({
      skip: options?.curPage ?? 0,
      take: options?.pageNum ?? 10,
    });
  }
  async store(data) {
    return await this.hotelReposity.save(data);
  }
}
