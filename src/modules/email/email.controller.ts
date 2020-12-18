import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor( private readonly emailService:EmailService, private readonly config:ConfigService){}
    @Get()
    sendMail(){
        this.emailService.sendEmail({
            to:'957196958@qq.com',
            from:this.config.get('EMAIL_FROM'),
            subject:'Ejs Tempalte',
            template:'hello',
            context:{
                name:'Edw4rd'
            },
            // text:'xxxxxxxxxxx'
        });
    }
}
