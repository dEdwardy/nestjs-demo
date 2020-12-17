import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor( private readonly emailService:EmailService){}
    @Get()
    sendMail(){
        this.emailService.sendEmail({
            to:'e124124@gmail.com',
            from:'141fasf41247@qq.com',
            subject:'Hello Test',
            template: 'hello'
        });
    }
}
