import { Controller, Get, Post, Body, HttpCode,HttpStatus} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { readFileSync, readdirSync,createReadStream, readFile } from 'fs'
import { createHash } from 'crypto';
import { resolve } from 'path'
const mineType = require('mime-types')
@Controller('email')
export class EmailController {
    constructor( private readonly emailService:EmailService, private readonly config:ConfigService){}
    count = 0;
    @Get()
    sendMail(){
        this.emailService.sendEmail({
            to:'957196958@qq.com',
            from:this.config.get('MAIL_USER'),
            subject:'Ejs Tempalte',
            template:'hello',
            context:{
                name:'Edw4rd',
            },
            // text:'xxxxxxxxxxx'
        });
    }
    @Get('2')
    async sendMail2(){
        this.emailService.sendEmail({
            to:'957196958@qq.com',
            from:this.config.get('MAIL_USER'),
            subject:'天气早知道',
            template:'weather',
            context:{
                name:'Edw4rd',
            }, 
            // text:'xxxxxxxxxxx'
        });
    }
    @Get('test')
    testBase64(){
        let filePath= resolve(__dirname,'../../templates/imgs','aleksey-kuprikov-LS9n3e-XDJI-unsplash.jpg')
        let data = readFileSync(filePath);
        let base64 = Buffer.from(data).toString('base64');
        let type = mineType.lookup(filePath)
        return `data:${type};base64,${base64}`
    }
    @Post('send-code')
    @HttpCode(HttpStatus.OK)
    async sendCode(@Body() data){
      let { email } = data
      let code = await this.emailService.generateCode(email)
      this.emailService.sendCode({to:email,code})
    }
}
