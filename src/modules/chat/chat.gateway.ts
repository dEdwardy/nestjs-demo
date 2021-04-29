import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit,OnGatewayConnection } from '@nestjs/websockets';
import { Console } from 'console';
import { RedisService } from 'nestjs-redis';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  constructor(
    private redisService: RedisService
  ) { }
  afterInit(server) {
    // console.log(server)
  }
  OnGatewayConnection(client){
    console.log('ClientId:'+client.id+'进入')
  }
  handleConnection(client) {
    console.log('ClientId:'+client.id+'进入')
  }
  handleDisconnect(client) {
    console.log('ClientId:'+client.id+'离开')
  }
  @WebSocketServer() server;
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(payload+'xxxxxxxxxxxxxxxxxxxxxxxxxxx')
    return 'Hello world!';
  }
}
