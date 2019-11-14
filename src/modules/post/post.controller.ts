import { Controller, Body, Post, Delete, Param, Put, Get, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query } from '@nestjs/common';
import { postDto } from './post.dto';
import { PostService } from './post.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../core/decorators/user.decorator';
import { User as UserEntity } from '../user/user.entity';
import { ListOptions } from '../../core/decorators/list-options.decorator';
import { ListOptionsInterface } from '../../core/interfaces/list-options.interface';

@ApiUseTags('Posts')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
    constructor(
        private readonly postService: PostService
    ){

    }
    @Post()
    @ApiOperation({ title: '添加post' })
    @UseGuards(AuthGuard('jwt'))
    addPost(@Body() data:postDto,@User() user:UserEntity){
        console.log({user})
        return this.postService.addPost(data, user)
    }
    
    @Post(':id/vote')
    @ApiOperation({ title: '用户给post(帖子) 投票/喜欢/点赞等' })
    @UseGuards(AuthGuard('jwt'))
    async vote(@Param('id') id:string,@User() user:UserEntity){
        console.log(user)
        return this.postService.vote(id, user)
    }

    @Delete(':id/unvote')
    @ApiOperation({ title: '用户给post(帖子) 取消 投票/喜欢/点赞等' })
    @UseGuards(AuthGuard('jwt'))
    async unVote(@Param('id') id:string,@User() user:UserEntity){
        console.log(user)
        return this.postService.unVote(id, user)
    }

    @Delete(':id')
    @ApiOperation({ title: '根据Id删除post' })
    deletePost(@Param('id') id:string){
        return this.postService.deletePost(id)
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: '修改post' })
    updatePost(@Param('id') id:string, @Body() data:postDto){
        console.log({data})
        return this.postService.updatePost(id, data)
    }

    @Get()
    @ApiOperation({ title: '查询所有post'})
    getAll(@ListOptions({limit:10}) options:ListOptionsInterface){
        return this.postService.getAll(options)
    }

    @Get(':id')
    @ApiOperation({ title: '根据Id查询单个post'})
    getOne(@Param('id') id:string){
        return this.postService.getOne(id)
    }

    @Get(':id/liked')
    @UseInterceptors(ClassSerializerInterceptor)
    async liked(@Param('id') id:string){
        return await this.postService.liked(id)
    }
}
