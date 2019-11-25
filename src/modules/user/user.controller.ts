import { Controller, Get, Param, Query, Post, Body, Delete, Put, UseInterceptors, ClassSerializerInterceptor, SetMetadata, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service'
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { userDto, updatePwdDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from '../../core/decorators/permissions.decorator';
import { UserRole } from '../../core/interfaces/enums/user-role.enum';
import { AccessGuard } from '../../core/guards/access.guard';

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
    
    @Put(':id/changePwd')
    @ApiOperation({ title: '修改用户密码' })
    updateUser(@Param('id') id: string,@Body() data:updatePwdDto) {
        return this.userService.updatePwd(id, data);
    }
    
    @Put(':id/role')
    @Permissions({ role: UserRole.ADMIN})
    @UseGuards(AuthGuard(),AccessGuard)
    @ApiOperation({ title: '修改用户角色' })
    async update(
        @Param('id') id:string,
        @Body() data: userDto
    ){
        return await this.userService.update(id,data);
    }

    @Get(':id')
    @ApiOperation({ title: '根据ID查询用户' })
    getUser(@Param('id') id: string): Promise<any> {
        return this.userService.findUserById(id);
    }

    @Get(':username')
    @ApiOperation({ title: '根据Username查询用户' })
    getUserByName(@Param('username') username: string): Promise<any> {
        return this.userService.findByName(username);
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

    @Get(':id/possess/:resource/:resourceId')
    async possess(
        @Param('id') id:string,
        @Param('resource') resource:string,
        @Param('resourceId') resourceId:string,
    ){
        return this.userService.possess(id, resource, resourceId)
    }
}
