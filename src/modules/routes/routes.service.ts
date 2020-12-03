import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routes } from './routes.entity';
import { routesDto } from './routes.dto';
@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(Routes)
        private readonly routesRepository: Repository<Routes>
    ) { }
    store(data: Partial<routesDto>) {
        return this.routesRepository.create(data)
    }
    getAll() {
        return this.routesRepository.find();
    }
}
