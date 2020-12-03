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
    async getRoutesTree() {
        let arr = await this.routesRepository.find();
        let tree = this.array2Tree(arr);
        return  tree
    }

     array2Tree(arr){
        if(!Array.isArray(arr) || !arr.length) return;
        let map = {};
        arr.forEach(item => map[item.id] = item);
    
        let roots = [];
        arr.forEach(item => {
            const parent = map[item.parentId];
            if(parent){
                (parent.children || (parent.children=[])).push(item);
            }
            else{
                roots.push(item);
            }
        })
    
        return roots;
    }
}
