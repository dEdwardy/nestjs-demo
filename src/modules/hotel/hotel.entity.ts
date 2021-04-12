import { Entity, PrimaryGeneratedColumn, Column ,OneToMany} from "typeorm";
import { Room } from "../room/room.entity";

@Entity()
export class Hotel{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({ length: 255})
    name:string;

    @Column({ length: 255})
    location:string;

    @Column('text',{ nullable: true})
    desc:string;

    @Column({ nullable:true})
    tags:string;

    @Column({
      type:'float'
    })
    rate:Number;

    @Column({nullable:true})
    img:string;

    @OneToMany(type => Room, room => room.hotel)
    rooms:Room[];
}