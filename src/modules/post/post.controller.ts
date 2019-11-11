import { Controller, Body, Post, Delete, Param, Put, Get, Req, UseGuards } from '@nestjs/common';
import { postDto } from './post.dto';
import { PostService } from './post.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../core/decorators/user.decorator';
import { User as UserEntity } from '../user/user.entity';

@ApiUseTags('Posts')
@Controller('posts')
export class PostController {
    constructor(
        private readonly postService: PostService
    ){

    }
    @Post()
    @ApiOperation({ title: '添加post' })
    @UseGuards(AuthGuard('jwt'))
    addPost(@Body() data:postDto,@User() user:UserEntity){
        console.log(user)
        return this.postService.addPost(data, user)
    }
    
    @Delete(':id')
    @ApiOperation({ title: '根据Id删除post' })
    deletePost(@Param('id') id:string){
        return this.postService.deletePost(id)
    }

    @Put(':id')
    @ApiOperation({ title: '修改post' })
    updatePost(@Param('id') id:string, data:postDto){
        return this.postService.updatePost(id, data)
    }

    @Get()
    @ApiOperation({ title: '查询所有post'})
    getAll(){
        return this.postService.getAll()
    }

    @Get(':id')
    @ApiOperation({ title: '根据Id查询单个post'})
    getOne(@Param('id') id:string){
        return this.postService.getOne(id)
    }
}
