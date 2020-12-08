import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../core/decorators/user.decorator';
import { User as UserEntity } from '../user/user.entity';

@Controller('friends')
export class FriendController {
    constructor(private readonly friendService:FriendService){}
    // @Get()
    async test(){
        return await this.friendService.root();
    }

    @Get()
    @UseGuards(AuthGuard())
    async getFriends(@User() user:UserEntity){
        // console.log('-----------')
        // console.log(user)
        return await this.friendService.getFriends(user.id);
    }

    @Post()
    @UseGuards(AuthGuard())
    async addFriend(@Body() data, @User() user:UserEntity) {
        const { friendId } = data;
        return await this.friendService.addFriend({ userId:user.id,friendId})
    }
}
