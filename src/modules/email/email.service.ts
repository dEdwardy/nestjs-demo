import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
    private readonly cacheService: CacheService
  ) {}
  sendEmail(data) {
    this.mailerService.sendMail(data);
  }
  sendEmailToMe(infos) {
    this.mailerService.sendMail({
      to: '957196958@qq.com',
      from: this.config.get('MAIL_USER'),
      subject: 'Ejs Tempalte',
      template: 'hello',
      context: {
        name: '滚起来搬砖',
      },
    });
  }
  async sendCode(data) {
    let code = await this.generateCode(data.to);
    console.log('code---------' + code);
    this.mailerService.sendMail({
      to: data.to,
      from: this.config.get('MAIL_USER'),
      subject: 'V3-Mall Code',
      template: 'hello',
      sender: 'Code',
      context: {
        name: `您的验证码为${code}，千万不要告诉他人哟！`,
      },
    });
  }
  //生成验证码（和登录状态一起存到redis）
  async generateCode(key) {
    const arr:any = [0,1,2,3,4,5,6,7,8,9];
    for (let i = 65; i < 91; i++) {
      arr.push(String.fromCharCode(i))
      arr.push(String.fromCharCode(i).toLowerCase())
    }
    const  rand1 =  arr[Math.floor((Math.random()*arr.length))]+'';
    const  rand2 =  arr[Math.floor((Math.random()*arr.length))]+'';
    const  rand3 =  arr[Math.floor((Math.random()*arr.length))]+'';
    const  rand4 =  arr[Math.floor((Math.random()*arr.length))]+'';
    const  rand5 =  arr[Math.floor((Math.random()*arr.length))]+'';
    const  rand6 =  arr[Math.floor((Math.random()*arr.length))]+'';
    // console.log(rand1+rand2+rand3+rand4+rand5+rand6)
    let code = rand1+rand2+rand3+rand4+rand5+rand6
    await this.cacheService.set(key,code, 300)
    return code
  }
  getCode(key) {
    return this.cacheService.get(key) 
  }
}
