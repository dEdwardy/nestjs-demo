import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [EmailService],
  controllers: [EmailController],
  imports:[ConfigModule]
})
export class EmailModule {}
