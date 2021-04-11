import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { EmailService } from '../email/email.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SpiderModule } from '../spider/spider.module';
import { EmailModule } from '../email/email.module';

@Module({
  providers: [TaskService],
  imports: [ScheduleModule.forRoot(),SpiderModule,EmailModule]
})
export class TaskModule {}
