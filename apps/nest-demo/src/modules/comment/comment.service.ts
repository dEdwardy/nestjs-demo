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
    async update(id: string, data:CommentDto) {
        return await this.commentRepository.update(id, data);
    }
    async delete(id:string) {
        return await this.commentRepository.delete(id)
    }
    async showPostComments(id:string) {
        return await this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user','user')
            .leftJoinAndSelect('comment.post','post')
            .where('post.id = :id',{ id })
            .getMany()
    }
    async showUserComments(id:string) {
        return await this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user','user')
            .leftJoinAndSelect('comment.post','post')
            .where('user.id = :id',{ id })
            .getMany()
    }
}
