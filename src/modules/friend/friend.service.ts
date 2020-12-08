import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { FriendDto } from './friend.dto';
import { UserService } from '../user/user.service';
import { from } from 'rxjs'

@Injectable()
export class FriendService {
    constructor(
        private readonly redisService:RedisService,
        private readonly userService: UserService
    ){}
    async root():Promise<any>{
        const client = await this.redisService.getClient();
        console.log(client)
        return true;
    }
    async addFriend(dto:FriendDto){
        const { userId, friendId } = dto;
        const client = await this.redisService.getClient();
        await client.sadd(userId, friendId)
        await client.sadd(friendId, userId)
        return true
    }
    async deleteFriend(dto:FriendDto){
        const { userId, friendId } = dto;
        const client = await this.redisService.getClient();
        await client.srem(userId, friendId)
        await client.srem(friendId, userId)
        return true
    }
    async getFriends(id:string){
        const friendsIds = await this.redisService.getClient().smembers(id);
        const friends = await this.userService.findUserById(friendsIds)
        return {
            friends
        }
    }
}
