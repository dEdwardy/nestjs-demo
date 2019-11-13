import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { CommentDto } from './comment.dto';
import { User } from '../user/user.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>
    ){ }
    
    async storePostComment(id:string, user:User, data:CommentDto){
        return await this.commentRepository.save({
            user,
            ...data,
            post:{ id }
        })
    }
}
