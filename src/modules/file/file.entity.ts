import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class File{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:true})
    uid?:string;

    @Column({nullable:true})
    hash?:string;

    @Column()
    originalname:string;

    @Column()
    filename:string;

    @Column()
    mimetype:string;

    @Column()
    size:number;
}