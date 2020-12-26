import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { EmailService } from '../email/email.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [TaskService, EmailService],
  imports: [ScheduleModule.forRoot()]
})
export class TaskModule {}
