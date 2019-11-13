import { Controller, Post, UseGuards, UseInterceptors, ClassSerializerInterceptor, Param, Body, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { CommentDto } from './comment.dto';
import { User } from '../../core/decorators/user.decorator';
import { User as UserEntity } from '../user/user.entity';

@Controller()
export class CommentController {
    constructor(
        private readonly commentService:CommentService
    ){}
    @Post('posts/:id/comments')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(ClassSerializerInterceptor)
    async storePostComment(
        @Param('id') id:string,
        @Req() req,
        @Body() data:CommentDto,
        @User() user: UserEntity){
            console.log({user})
            console.log(req.user)
            return await this.commentService.storePostComment(id, req.user, data)
    }

}
