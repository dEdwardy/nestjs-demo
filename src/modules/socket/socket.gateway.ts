import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UserService } from '../user/user.service';
import { UserStatus } from 'src/core/interfaces/enums/user-status.enum';

let num = 0;
@WebSocketGateway()
export class SocketGateway {
  constructor(private userService: UserService){}
  users = [];
  @WebSocketServer()
  server;
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    num++;
    // console.log(payload.name+'进来了---总人数：'+num);
    console.log(`SocketID:${client.id}--${payload.name}进来了`)
    // client.broadcast.emit('message',{
    //   returnVal:payload.name+'进入房间'
    // })
    client.broadcast.emit('message',{
      returnVal: payload.name+'：'+payload.message 
    })
    client.on('disconnect', () => {
      num--;
      console.log(`SocketID:${client.id}--${payload.name}离开了`)
    })
    console.log(payload)
    return { 
      event:'message',
      data:{
        returnVal: payload.name+'：'+payload.message 
      }
    };
  }
  
  @SubscribeMessage('login')
  handleLogin(client, payload){
    console.log(`ClienID:${client.id}--登录成功`)
    this.users.push({
      id:client.id,
      status: UserStatus.ONLINE
    })
    client.on('disconnect', () => {
      let idx = this.users.findIndex((value, index, arr) => {
        return value.id ==client.id
      })
      this.users.splice(0,idx)
      console.log(`SocketID:${client.id}--退出成功`)
      console.log(this.users)
    })
    return false;
  }
}
