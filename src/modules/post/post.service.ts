import { Injectable } from '@nestjs/common';
import { postDto } from './post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private readonly postRepository:Repository<Post>
    ){

    }
    addPost(data:postDto){
        return this.postRepository.save(data)
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
