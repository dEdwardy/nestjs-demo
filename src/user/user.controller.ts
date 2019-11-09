import { Controller, Get, Param, Query, Post, Body, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from './user.entity';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { UserDto } from './user-dto'
@Controller('user')
@ApiUseTags('用户')
export class UserController {
    constructor(public userService:UserService){

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
    @ApiOperation({
        title:'添加用户'
    })
    addUser(@Body() params:UserDto){
        let user =new User();
        user.name = params.name;
        return this.userService.addUser(user)
    }
    @Delete()
    @ApiOperation({
        title:'删除用户'
    })
    deleteUser(@Body() params:UserDto){
        let user = new User();
        user.id = params.id;
        return this.userService.deleteUser(user);
    }
    // @gi
    @Get('/:id')
    @ApiOperation({
        title:'根据ID查询用户'
    })
    getUser(@Param() id){
        return this.userService.findUser(id);
    }
    @Get('/')
    @ApiOperation({
        title:'查询所有用户'
    })
    getAll(){
        return this.userService.findAll();
    }
}
