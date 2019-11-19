import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude,Expose } from 'class-transformer'
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { Role } from '../role/role.entity';
@Entity()
@Exclude()
export class User {
    @PrimaryGeneratedColumn('uuid', { comment: '主键' })
    @Expose()
    id: string;

    @Column({ comment: '用户名', length: 50, unique: true })
    @Expose()
    username: string;

    @Column({ comment: '密码', length: 50 })
    password: string;

    @Column({ comment: '邮箱', length: 50, unique: true,select: false })
    email: string;
    
    @CreateDateColumn({ comment: '创建日期' })
    @Expose()
    created: Date;

    @UpdateDateColumn({ comment: '修改日期' })
    @Expose()
    updated: Date;

    @OneToMany(type => Post, post => post.user)
    @Expose()
    posts: Post[];

    //中间表 多对多
    @ManyToMany(type => Post, post => post.liked)
    @JoinTable()
    @Expose()
    voted: Post[]

    @OneToMany(type => Comment, comment => comment.user)
    @Expose()
    comments: Comment[];

    @ManyToMany(type => Role, role => role.users)
    @JoinTable()
    @Expose()
    roles: Role[];

    async comparePwd(pwd: string) {
        console.log(pwd)
        console.log(this.password)
        return pwd === this.password;
    }

}
