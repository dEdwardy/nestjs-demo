import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../post/post.entity";
import { User } from "../user/user.entity";

@Entity()
export class Comment{
    @PrimaryGeneratedColumn('uuid')
    id:number;

    @Column({ nullable: true})
    title:string;

    @Column()
    body:string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @ManyToOne(type => Post, post => post.comments,{ nullable:false })
    post: Post;

    @ManyToOne(type => User, user => user.comments,{ nullable:false })
    user: User;

}