import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
@ApiUseTags('Auth')
export class AuthController {
    constructor(private readonly authService:AuthService){

    }
    @Post('login')
    @ApiOperation({ title: '登录'})
    @HttpCode(HttpStatus.OK)
    async login(@Body() data:LoginDto, @Req() req){
        console.log(req.ip)
        return await this.authService.login(data)
    }
    @Post('app-login')
    @ApiOperation({ title: 'App登录'})
    @HttpCode(HttpStatus.OK)
    async appLogin(@Body() data){
        return await this.authService.appLogin(data)
    }
    @Get('test')
    @UseGuards(AuthGuard('jwt'))
    async authTest(){
        return {
            message:'ok'
        }
    }
}
