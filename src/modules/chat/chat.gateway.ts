import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection } from '@nestjs/websockets';
import { RedisService } from 'nestjs-redis';
import { Client, Server } from 'socket.io';
import { CacheService } from '../cache/cache.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  constructor(
    private redisService: RedisService,
    private cacheService: CacheService
  ) { }
  ROOM_DEFAULT = 'room_default';
  @WebSocketServer() server: Server;

  afterInit (server) {
    // console.log(server)
  }
  handleConnection (client) {
    // console.log('ClientId:'+client.id+'进入')
  }
  handleDisconnect (client) {
    // console.log(client?.handshake?.query.token)
    // console.log('ClientId:'+client.id+'离开')
  }
  @SubscribeMessage('login')
  async handleLogin (client:any, name: string) {
    try {
      //加入默认房间
      client.join(this.ROOM_DEFAULT)
      //广播 有人进来了  通知用户更新 好友列表
      this.server.to(this.ROOM_DEFAULT).emit('onlineChange',`${name}进来了`)
      //redis 存储登录状态
      await this.cacheService.sadd('online_users', name)
    } catch (err) {
      console.log(err)
    }
  }

  @SubscribeMessage('logout')
  async handleLogout (client:any, name) {
    console.log('logout', name)
    try {

      this.server.to(this.ROOM_DEFAULT).emit('message',`${name}离开了`)
      await this.cacheService.srem('online_users', name)
    } catch (err) {
      console.log(err)
    }

  }
  @SubscribeMessage('online_users')
  async getOnlines (client) {
    console.log('get online_users')
    try {
      //@ts-ignore
      const users = await this.redisService.getClient().smembers('online_users')
      return {
        event: 'online_users',
        data: users
      }
    } catch (err) {
      console.log(err)
    }

  }

  @SubscribeMessage('message')
  handleMessage (client: any, payload: any): string {
    console.log(payload + 'xxxxxxxxxxxxxxxxxxxxxxxxxxx')
    return 'Hello world!';
  }
}
