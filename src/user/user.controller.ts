import { Controller, Get, Param, Query, Post, Body, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from './user.entity';
@Controller('user')
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
    addUser(@Body() params){
        let user =new User();
        user.name = params.name;
        return this.userService.addUser(user)
    }
    @Delete()
    deleteUser(@Body() params){
        let user = new User();
        user.id = params.id;
        return this.userService.deleteUser(user);
    }
    // @Put()
    // updateUser(@Body() params){
    //     let user = new User();
    //     user.id = params.id;
    //     user.name = params.name;
    //     return ;
    // }
    @Get('/:id')
    getUser(@Param() id){
        return this.userService.findUser(id);
    }
    @Get('/')
    getAll(){
        return this.userService.findAll();
    }
}
