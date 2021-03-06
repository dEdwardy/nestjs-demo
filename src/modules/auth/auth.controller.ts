import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
@ApiUseTags('AUth')
export class AuthController {
    constructor(private readonly authService:AuthService){

    }
    @Post('login')
    @ApiOperation({ title: '登录'})
    async login(@Body() data:LoginDto){
        return await this.authService.login(data)
    }
    @Get('test')
    @UseGuards(AuthGuard('jwt'))
    async authTest(){
        return {
            message:'ok'
        }
    }
}
