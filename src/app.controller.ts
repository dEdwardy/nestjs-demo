import { Controller, Get, Param, Query,Post, Body, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }
    private readonly logger = new Logger()
   
    @Post('webrtc') 
    handleWebRTC(@Body() data){
      this.logger.debug('监听到webrtc')
      this.logger.debug(data)
      console.log(data)
      return 200
    }
}
