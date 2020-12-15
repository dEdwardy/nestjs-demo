import { Controller, Get } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Controller('socket')
export class SocketController {
    constructor(
        private readonly socketGatWay: SocketGateway
    ){}
    @Get()
    async get():Promise<any>{
        let server = this.socketGatWay.server;
        console.log(server)
        let sockets = server.sockets;
        console.log(sockets)
        return 'hello'
    }
}
