import { Injectable } from '@nestjs/common';
import { postDto } from './post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private readonly postRepository:Repository<Post>
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
    deletePost(id:string){
        return this.postRepository.delete(id)
    } 
    updatePost(id:string, data:postDto){
        return this.postRepository.update(data,{ id });
    }
    getAll(){
        return this.postRepository.find()
    }
    getOne(id:string){
        return this.postRepository.find({ id })
    }
}
