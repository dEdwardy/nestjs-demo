import { Get, Injectable } from '@nestjs/common';
import { Room } from './room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomReposity: Repository<Room>
  ) { }

  async getRoomByHotelId (hotelId: number) {
    // return await this.roomReposity
    //   .createQueryBuilder('room')
    //   // .leftJoinAndSelect('room.hotel', 'hotel')
    //   .where('room.hotelId = :hotelId', { hotelId })
    //   .getMany()
    return await this.roomReposity.find({ where : { hotel:hotelId }})
  }
  store(data){
    return this.roomReposity.save(data)
  }
}
