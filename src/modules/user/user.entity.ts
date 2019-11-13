import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer'
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid', { comment: '主键' })
    id: string;

    @Column({ comment: '用户名', length: 50, unique: true })
    username: string;

    @Exclude()
    @Column({ comment: '密码', length: 50 })
    password: string;

    @Exclude()
    @Column({ comment: '邮箱', length: 50, unique: true })
    email: string;

    @CreateDateColumn({ comment: '创建日期' })
    created: Date;

    @UpdateDateColumn({ comment: '修改日期' })
    updated: Date;

    @OneToMany(type => Post, post => post.user)
    posts: Post[];

    //中间表 多对多
    @ManyToMany(type => Post, post => post.liked)
    @JoinTable()
    voted: Post[]

    @OneToMany(type => Comment, comment => comment.user)
    comments: Comment[];

    async comparePwd(pwd: string) {
        return pwd === this.password;
    }

}
