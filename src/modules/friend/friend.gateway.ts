import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RedisService } from 'nestjs-redis';
import { UserService } from '../user/user.service';

@WebSocketGateway()
export class FriendGateway {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService
){}
  @WebSocketServer()
  server;
  @SubscribeMessage('add-friend')
  handleMessage(client: any, payload: any){
    const { userId, friendId } = payload;
    client.to()
    return 'Hello world!';
  }
}
