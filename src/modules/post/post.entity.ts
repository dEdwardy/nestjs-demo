import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    readonly id:string;

    @Column()
    title:string;

    @Column('longtext', { nullable: true})  
    body:string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @ManyToOne(type => User, user =>user.posts)
    user:User;
}