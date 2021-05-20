import { Logger, UseFilters } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, BaseWsExceptionFilter } from '@nestjs/websockets';
import { RedisService } from 'nestjs-redis';
import { Client, Server } from 'socket.io';
import { WsExceptionsFilter } from '../../core/filters/ws-exception.filter';
import { CacheService } from '../cache/cache.service';

@WebSocketGateway()
@UseFilters(new WsExceptionsFilter)
export class ChatGateway implements OnGatewayInit {
  constructor(
    private redisService: RedisService,
    private cacheService: CacheService
  ) { }
  private readonly logger = new Logger()
  ROOM_DEFAULT = 'room_default';
  // userMap:any = new Map()
  userMap:any = {};
  @WebSocketServer() server: Server;

  afterInit (server) {
    // console.log(server)
  }
  handleClose(client){
    this.logger.debug(`连接已断开`)
  }
  handleConnection (client) {
    this.logger.debug(`${client.id}              已连接`)
    // console.log('ClientId:'+client.id+'进入')
  }
  handleDisconnect (client) {
    this.logger.debug(`${client.id}           已断开连接`)
    // console.log(client?.handshake?.query.token)
    // console.log('ClientId:'+client.id+'离开')
  }
  @SubscribeMessage('login')
  async handleLogin (client:any, name: string) {
    try {
      this.logger.debug(`${name}登录了`)
      // this.userMap.set(name,client.id)
      this.userMap[name] = client.id
      this.logger.debug(JSON.stringify(this.userMap))
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
    try {
      this.logger.debug(`${name}退出了`)
      // this.userMap.delete(name)
      delete this.userMap[name]
      this.logger.debug(JSON.stringify(this.userMap))
      this.server.to(this.ROOM_DEFAULT).emit('message',`${name}离开了`)
      this.server.to(this.ROOM_DEFAULT).emit('onlineChange',`${name}离开了`)
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
  
  @SubscribeMessage('chat')
  handleChat(client:any,payload){
    this.logger.debug(`chat from ${payload.from} to ${payload.to}: ${payload.msg}`)
    this.logger.debug(JSON.stringify(this.userMap))
    let toId = this.userMap[payload.to]
    client.to(toId).emit('chat',{
      ...payload,
      time:Date.now(),
      unread: true
    })
  }

  //webrtc  
  @SubscribeMessage('icecandidate')
  onIceCandidate(client,payload){
    this.logger.debug(`icecandidate`)
    this.logger.debug(payload?.icecandidate)
    this.logger.debug(client?.id)
    let socketId = this.userMap[payload.username]
    this.server.to(socketId).emit('icecandidate',{ icecandidate:payload?.icecandidate, id: client?.id })
  }

  @SubscribeMessage('offer')
  onOffer(client,payload){
    this.logger.debug('offer',payload.offer)
    let socketId = this.userMap[payload.username]
    this.server.to(socketId).emit('called',{ offer:payload.offer,id:client.id,username:payload.username})
  }

  @SubscribeMessage('answer')
  onAnswer(client,payload){
    let socketId = this.userMap[payload.username]
    this.logger.debug('answer',payload)
    this.server.to(socketId).emit('answer', {answer:payload.answer})
  }
  
  @SubscribeMessage('rejectCall')
  onRejectCall(client,payload){
    let socketId = this.userMap[payload.username]
    this.server.to(socketId).emit('callRejected')
  }
}
