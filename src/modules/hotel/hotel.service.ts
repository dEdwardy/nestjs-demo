import { Injectable } from '@nestjs/common';
import { Hotel } from './hotel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel) private readonly hotelReposity: Repository<Hotel>
  ) { }
  async getHotelInfo () {
    return this.hotelReposity.find()
  } 
  async store(data){
    return await this.hotelReposity.save(data)
  }
}
