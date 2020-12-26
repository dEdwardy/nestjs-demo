import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';

@Injectable()
export class TaskService {
    constructor(private readonly emailService:EmailService){
    }
    
    private readonly logger = new Logger(TaskService.name)
   
    /**
     * 定时8点 发送天气预报
     */
    @Cron('0 0 8 * * *',{
        name:'daily-weather'
    })
    handleSend(){
        this.emailService.sendEmailToMe()
        this.logger.debug('send qq email at 8 am every day')
    }

    // @Cron('2 * * * * *')
    // handleCorn(){
    //     this.logger.debug('Called when the second is 45')
    // }
    

    // @Interval(10000)
    // handleInterval(){
    //     this.logger.debug('Called every 10 seconds')
    // }

    // @Timeout(5000)
    // handleTimeout(){
    //     this.logger.debug('Called once after 5 seconds')

    // }
}
