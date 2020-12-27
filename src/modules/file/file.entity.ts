import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class File{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:true})
    hash?:string;

    @Column()
    originalname:string;

    @Column()
    filename:string;

    @Column({nullable:true})
    mimetype:string;

    @Column()
    size:number;
}