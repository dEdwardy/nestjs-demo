import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { UserService } from '../user/user.service';
import { UserStatus } from '../../core/interfaces/enums/user-status.enum';
import { RedisService } from 'nestjs-redis';

let num = 0;
@WebSocketGateway()
export class SocketGateway implements OnGatewayInit {
  constructor(
    private userService: UserService,
    private redisService: RedisService
  ) { }
  afterInit(server) {
    console.log(server)
  }
  handleConnection(client) {
    // console.log('ClientId:'+client.id+'进入')
  }
  handleDisconnect(client) {
    // console.log('ClientId:'+client.id+'离开')
  }

  users = [];
  @WebSocketServer() server;
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    num++;
    // console.log(payload.name+'进来了---总人数：'+num);
    console.log(`SocketID:${client.id}--${payload.name}进来了`)
    // client.broadcast.emit('message',{
    //   returnVal:payload.name+'进入房间'
    // })
    client.broadcast.emit('message', {
      returnVal: payload.name + '：' + payload.message
    })
    client.on('disconnect', () => {
      num--;
      console.log(`SocketID:${client.id}--${payload.name}离开了`)
    })
    console.log(payload)
    return {
      event: 'message',
      data: {
        returnVal: payload.name + '：' + payload.message
      }
    };
  }

  userMap = new Map();
  onlineMap = new Map();

  @SubscribeMessage('login')
  async handleLogin(client, payload) {
    let id = payload.id;
    this.userMap.set(id, client.id);
    //获取id 的 friends ids 
    let friendsIds = await this.redisService.getClient().smembers(id);
    //用户(id)的在线好友
    let online = [];
    friendsIds.map(item => {
      if (this.userMap.has(item)) {
        // this.onlineMap.set(item,this.userMap.get(item))
        online.push({ id: item, socketId: this.userMap.get(item) })
      }
    })
    //如果好友在线 则通知好友我已经上线
    if (online && online.length > 0) {
      for (let item of online) {
        // client.to(item.socketId).emit('friends-on',{ id, socketId: client.id})
        let refreshFriendsList = await this.getOnlineFriendsList(item.id); 
        client.to(item.socketId).emit('friends-fresh', refreshFriendsList)
      }
    }
    console.log(`SocketID:${client.id},ID:${payload.id}--登录成功`)

    client.on('disconnecting', async() => {
      this.userMap.delete(id);
      if (online && online.length > 0) {
        for (let item of online) {
          // client.to(item.socketId).emit('friends-off',{ id, socketId: client.id})
          let refreshFriendsList = await this.getOnlineFriendsList(item.id); 
          client.to(item.socketId).emit('friends-fresh', refreshFriendsList)
        }
      }
      console.log(`SocketID:${client.id},ID:${payload.id}--退出成功`)
    })
    console.log({ online })
    return {
      event: "online",
      data: {
        online
      }
    };
  }

  //根据用户id获取 用户 在线好友列表
  async getOnlineFriendsList(id){

    let friendsIds = await this.redisService.getClient().smembers(id);
    let online = [];
    friendsIds.map(item => {
      if (this.userMap.has(item)) {
        // this.onlineMap.set(item,this.userMap.get(item))
        online.push({ id: item, socketId: this.userMap.get(item) })
      }
    })
    return online;
  }
}
