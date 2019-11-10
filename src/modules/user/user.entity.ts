import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import {Exclude } from 'class-transformer'
import { type } from 'os';
import { Post } from '../post/post.entity';
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid',{ comment: '主键'})
    id: string;

    @Column({ comment: '用户名', length: 50, unique: true })
    username: string;

    @Exclude()
    @Column({ comment: '密码', length: 50 })
    password: string;
    
    @Exclude()
    @Column({ comment: '邮箱', length: 50, unique: true })
    email: string;

    @OneToMany(type => Post, post => post.user)
    posts:Post[];
    
    async comparePwd(pwd:string) {
        return pwd === this.password;
    }

}
