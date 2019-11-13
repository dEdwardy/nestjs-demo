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
    async beforeTag(tags:Partial<Tag>[]) {
        const _tags = tags.map(async item => {
        const {id, name} = item;
        if(id){
            const _tag = await this.tagRepository.findOne(id)
            if(_tag){
                return _tag;
            }
            return
        }      
        if(name) {
            const _tag = await this.tagRepository.findOne({ name})
            if(_tag) {
                return _tag;;
            }
            return await this.tagRepository.save(item)
        }
        })
        return Promise.all(_tags)
    }
    async addPost(data:postDto, user:User){
        const { tags } = data;
        if(tags){
            data.tags = await this.beforeTag(tags);
        }

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
    async updatePost(id:string, data:postDto){
        console.log({data})
        const { tags } =data;
        delete data.tags;
        await this.postRepository.update(id,data);
        const entity = await this.postRepository
            .findOne(id, { relations: ['category','tags']});
        if(tags){
            entity.tags = await this.beforeTag(tags);
        }
        return await this.postRepository.save(entity);
    }
    async getAll(options:ListOptionsInterface){
        // return this.postRepository.find({
        //     relations:['user','category']
        // })
        const { categories, tags } = options;
        const queryBuilder = await this.postRepository
            .createQueryBuilder('post');
        queryBuilder.leftJoinAndSelect('post.user', 'user');
        queryBuilder.leftJoinAndSelect('post.category', 'category');
        queryBuilder.leftJoinAndSelect('post.tags', 'tag');

        if(categories){
            queryBuilder.where('category.alias IN (:...categories)',{ categories })
        }
        if(tags){
            queryBuilder.andWhere('tag.alias IN (:...tags)',{ tags });
        }
        const entities = queryBuilder.getMany();
        return entities;
    }
    getOne(id:string){
        return this.postRepository.find({ id })
    }
}
