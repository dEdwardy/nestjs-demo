import { Injectable } from '@nestjs/common';
import { Hotel } from './hotel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { HotelOptions } from './hotel.dto';
import { Room } from '../room/room.entity';
import { ApiOperation } from '@nestjs/swagger';


class HotelOptions {
  curPage?: number;
  pageNum?: number;
  keywords?: string;
}
@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel) private readonly hotelReposity: Repository<Hotel>,
  ) { }
  async getHotelInfo (options: HotelOptions) {
    let { curPage, pageNum, keywords } = options
    const skipCount = ((curPage - 1) * pageNum) ?? 0
    const data = await this.hotelReposity
      .createQueryBuilder('hotel')
      .where('hotel.name like :name', { name: `%${keywords ?? ''}%` })
      .orWhere('hotel.location like :location', { location: `%${keywords ?? ''}%` })
      .orWhere('hotel.desc like :desc', { desc: `%${keywords ?? ''}%` })
      .orWhere('hotel.tags like :tags', { tags: `%${keywords ?? ''}%` })
      // .orWhere('hotel.location like %:location%',{ location:keywords })
      // .orWhere('hotel.desc like %:desc%',{ desc:keywords })
      // .orWhere('hotel.tags like %:tags%',{ tags:keywords })
      .skip(skipCount)
      .take(pageNum ?? 10)
      .orderBy('id')
      .getMany()

    // const data = () => this.hotelReposity.find({
    //   skip: skipCount,
    //   take: pageNum ?? 10,
    //   order: {
    //     id: 'ASC'
    //   },
    //   where:[
    //     { name:  }
    //   ]
    // });
    const total = await this.hotelReposity
      .createQueryBuilder('hotel')
      .where('hotel.name like :name', { name: `%${keywords ?? ''}%` })
      .orWhere('hotel.location like :location', { location: `%${keywords ?? ''}%` })
      .orWhere('hotel.desc like :desc', { desc: `%${keywords ?? ''}%` })
      .orWhere('hotel.tags like :tags', { tags: `%${keywords ?? ''}%` })
      .getCount()
    // const total = await this.hotelReposity.count()
    // const total = () => this.hotelReposity.count()
    // return Promise.all([data(), total()])
    return [data, total]
  }
  async store (data) {
    return await this.hotelReposity.save(data);
  }
}
