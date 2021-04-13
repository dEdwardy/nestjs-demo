import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Hotel } from "../hotel/hotel.entity";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;


  @Column('text', { nullable: true })
  desc: string;

  @Column({ nullable: true })
  tags: string;

  @Column({ nullable: true })
  img: string;

  @Column({
    type:'float'
  })
  rate:Number;

  @Column({
    type:'float'
  })
  price:Number;

  @ManyToOne(type => Hotel, hotel => hotel.rooms, { nullable: false })
  hotel: Hotel;

}