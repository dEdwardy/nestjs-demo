import { Injectable, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { postDto } from './post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { ListOptionsInterface } from '../../core/interfaces/list-options.interface';
import { Tag } from '../tag/tag.entity';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class PostService {
    constructor(
        @InjectRepository(Post) private readonly postRepository:Repository<Post>,
        @InjectRepository(Tag) private readonly tagRepository:Repository<Tag>,
    ){

    }
    async addPost(data:postDto, user:User){
        const entity = await this.postRepository.create(data);
        await this.postRepository.save({
            ...entity,
            user
        }) 
        return entity;
    }
    async vote(id:string, user:User){
        return await this.postRepository
                        .createQueryBuilder()
                        .relation(User,'voted')
                        .of(user)
                        .add(id);
    }

    async unVote(id:string, user:User){
        return await this.postRepository
                        .createQueryBuilder()
                        .relation(User,'voted')
                        .of(user)
                        .remove({ id });
    }
    async liked(id:string) {
        return await this.postRepository
                        .createQueryBuilder()
                        .relation(Post,'liked')
                        .of(id)
                        .loadMany();
    }
    deletePost(id:string){
        return this.postRepository.delete(id)
    } 
    updatePost(id:string, data:postDto){
        return this.postRepository.update(data,{ id });
    }
    async getAll(options:ListOptionsInterface){
        // return this.postRepository.find({
        //     relations:['user','category']
        // })
        const { categories } = options;
        const queryBuilder = await this.postRepository
            .createQueryBuilder('post');
        queryBuilder.leftJoinAndSelect('post.user', 'user');
        queryBuilder.leftJoinAndSelect('post.category', 'category');
        if(categories){
            queryBuilder.where('category.alias IN (:...categories)',{ categories })
        }
        const entities = queryBuilder.getMany();
        return entities;
    }
    getOne(id:string){
        return this.postRepository.find({ id })
    }
}
