import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn({
        comment: '主键'
    })
    id:number;
    @Column({
        comment: '名称',
        length: 30,
        unique: true
    })
    name: string;
}