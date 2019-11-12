import { Controller, Get, Param, Query, Post, Body, Delete, Put, UseInterceptors, ClassSerializerInterceptor, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service'
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { userDto, updatePwdDto } from './user.dto';

@Controller('users')
@ApiUseTags('用户')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(public userService: UserService) {

    }
    // @Get(":name")
    // getUser(@Param() param) {
    //     return `${param.name}`
    // }
    // @Get("/ ")
    // query(@Query() query) {
    //     return query 
    // }
    @Post()
    @ApiOperation({ title: '添加用户' })
    addUser(@Body() user: userDto): Promise<any> {
        return this.userService.addUser(user)
    }

    @Delete(':id')
    @ApiOperation({ title: '删除用户' })
    deleteUser(@Param('id') id: string): Promise<any> {
        return this.userService.deleteUser(id);
    }
    
    @Put(':id')
    @ApiOperation({ title: '修改用户密码' })
    updateUser(@Param('id') id: string,@Body() data:updatePwdDto) {
        return this.userService.updatePwd(id, data);
    }
    
    @Get(':id')
    @ApiOperation({ title: '根据ID查询用户' })
    getUser(@Param('id') id: string): Promise<any> {
        return this.userService.findUserById(id);
    }

    @Get()
    @ApiOperation({ title: '查询所有用户' })
    getAll() {
        return this.userService.findAll();
    }

    @Get(':id/liked')
    @ApiOperation({ title: '查询用户喜欢/投票的 posts' })
    async liked(@Param('id') id:string) {
        return this.userService.liked(id);
    }
}
