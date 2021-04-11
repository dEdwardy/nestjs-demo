import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';
import { SpiderService } from '../spider/spider.service';

@Injectable()
export class TaskService {
    constructor(private readonly emailService: EmailService, private infoService: SpiderService) {
    }

    private readonly logger = new Logger(TaskService.name)

    /**
     * 定时8点 发送天气预报
     */
    @Cron('0 0 8 * * *', {
        name: 'daily-weather'
    })
    async handleSend() {
        let data = await this.infoService.getInfoForMe();
        let info = data?.data?.now
        this.emailService.sendEmailToMe(info)
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

    // @Timeout(1000)
    // async handleTimeout(){
    //     let data = await this.infoService.getInfoForMe();
    //     let info = data?.data?.now
    //     console.log(info)
    //     // this.emailService.sendEmailToMe(info)
    //     this.logger.debug('Called once after 5 seconds')

    // }
}
