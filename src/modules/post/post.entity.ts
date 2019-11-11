import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    readonly id:string;

    @Column()
    title:string;

    @Column('longtext', { nullable: true})  
    body:string;

    @CreateDateColumn({ comment: '创建日期' })
    created: Date;

    @UpdateDateColumn({ comment: '修改日期' })
    updated: Date;


    @ManyToOne(type => User, user =>user.posts)
    user:User;

    @ManyToMany(type => User, user => user.voted)
    liked:User[]
}