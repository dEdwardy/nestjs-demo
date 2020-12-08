import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { Routes } from './routes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Routes])],
  providers: [RoutesService],
  controllers: [RoutesController]
})
export class RoutesModule {}
