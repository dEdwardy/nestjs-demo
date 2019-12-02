import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { UserService } from '../user/user.service';
import { RedisService } from 'nestjs-redis';
import { Message } from '../../core/interfaces/message.interface';
import { MessageType } from '../../core/interfaces/enums/message.enum';

let num = 0;
@WebSocketGateway()
export class SocketGateway implements OnGatewayInit {
  constructor(
    private userService: UserService,
    private redisService: RedisService
  ) { }
  userMap = new Map();
  onlineMap = new Map();
  afterInit(server) {
    // console.log(server)
  }
  handleConnection(client) {
    // console.log('ClientId:'+client.id+'进入')
  }
  handleDisconnect(client) {
    // console.log('ClientId:'+client.id+'离开')
  }

  @WebSocketServer() server;

  @SubscribeMessage('message')
  async message(client: any, payload: any) {
    console.log(payload)
    //判断消息接收者是否在线，在线则发送通知，不在则存储到redis中
    if(this.userMap.has(payload.to)){
      //online
      let socketId = this.userMap.get(payload.to)
      client.to(socketId).emit('messages',{...payload,date:new Date(), type:MessageType.ADD_FRIENDS, unread: true});
    }else{
      //offline
      let id = payload.to;
      //redis中存储了好友关系 所以消息key前添加'messages_'以区分
      await this.redisService.getClient().sadd('messages_'+id,JSON.stringify({...payload,date:new Date(), type:MessageType.ADD_FRIENDS, unread: true}))
    }
    return false;
  }
  
  @SubscribeMessage('handle_add_friend')
  async handleMessage(client, payload){
    console.log(payload)
    let  redis = this.redisService.getClient();
    if(payload.accept) {  
      //accept
      await redis.sadd(payload.to,payload.from);
      await redis.sadd(payload.from,payload.to);
    }
    await redis.del('messages_'+payload.to);
    return {
      event: 'message',
      data: {
        status: payload.accept ? true : false
      }
    }
  }

  @SubscribeMessage('login')
  async handleLogin(client, payload) {
    let id = payload.id;
    this.userMap.set(id, client.id);
    //获取id 的 friends ids 
    let friendsIds = await this.redisService.getClient().smembers(id);
    //用户(id)的在线好友
    let online = [];
    if(friendsIds.length>0){
      friendsIds.map(item => {
        if (this.userMap.has(item)) {
          // this.onlineMap.set(item,this.userMap.get(item))
          online.push({ id: item, socketId: this.userMap.get(item) })
        }
      })
    }

    //查询是否存在未读消息(即离线期间的消息)
    let redis = await this.redisService.getClient()
    let res = await redis.exists('messages_'+id)
    let messages;
    if(res ===1 ){
      messages =  await redis.smembers('messages_'+id)
    }
    //如果好友在线 则通知好友我已经上线
    if (online && online.length > 0) {
      for (let item of online) {
        let refreshFriendsList = await this.getOnlineFriendsList(item.id);
        client.to(item.socketId).emit('friends_fresh', refreshFriendsList)
      }
    }
    console.log(`SocketID:${client.id},ID:${payload.id}--登录成功`)

    client.on('disconnecting', async () => {
      console.log(`SocketID:${client.id},ID:${payload.id}--即将退出....`)
      this.userMap.delete(id);
      let online2 = [];
      if(friendsIds.length>0) {
        friendsIds.map(item => {
          if (this.userMap.has(item)) {
            online2.push({ id: item, socketId: this.userMap.get(item) })
          }
        })
      }
      if (online2 && online2.length > 0) {
        for (let item of online2) {
          let refreshFriendsList = await this.getOnlineFriendsList(item.id);
          client.to(item.socketId).emit('friends_fresh', refreshFriendsList)
        }
      }
      console.log(`SocketID:${client.id},ID:${payload.id}--退出成功....`)
    })
    return {
      event: "online",
      data: {
        online:online? online:[],
        messages: messages? messages:[]
      }
    };
  }

  //根据用户id获取 用户 在线好友列表
  async getOnlineFriendsList(id) {

    let friendsIds = await this.redisService.getClient().smembers(id);
    let online = [];
    friendsIds.map(item => {
      if (this.userMap.has(item)) {
        online.push({ id: item, socketId: this.userMap.get(item) })
      }
    })
    return online;
  }

  @SubscribeMessage('chat')
  async chatTo(client, payload) {
    let toSocketId = this.userMap.get(payload.to)
    console.log({
      from: client.id,
      to: toSocketId,
      message: payload.message
    })
    let message:Message = { from: payload.from, to:payload.to, message: payload.message, date:new Date(), type:MessageType.CHAT, unread: true}
    await client.to(toSocketId).emit('chat_to', message);
    return {
      event:'chat_status',
      data:true
    };
  }
}
