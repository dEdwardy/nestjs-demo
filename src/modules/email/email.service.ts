import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService:MailerService){}
    sendEmail(data){
        this.mailerService.sendMail(data)
    }
}
