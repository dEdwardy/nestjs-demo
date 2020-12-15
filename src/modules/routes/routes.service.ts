import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routes } from './routes.entity';
import { routesDto } from './routes.dto';
@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(Routes)
        private readonly routesRepository: Repository<Routes>,
    ) { }
    store(data: Partial<routesDto>) {
        return this.routesRepository.save(data);
    }
    getAll() {
        return this.routesRepository.find();
    }
    async getRoutesTree() {
        let arr = await this.routesRepository.find();
        let tree = this.array2Tree(arr);
        return tree;
    }
    async updateRoute(data) {
        let entity = await this.routesRepository.findOne(data.id);
        let { id, ...params } = data;
        entity = {
            ...entity,
            ...params,
        };
        return await this.routesRepository.save(entity);
    }
    async delteRoute(parentId:number){
        let current= await this.routesRepository.findOne(parentId)
        let arr = [current]
        this.array2Tree(arr);
        // @ts-ignore
        let flatArr = arr.flat(Infinity);
        let ids = []
        flatArr.forEach( item => ids.push({id:item.id}));
        console.log(ids)
        // return await this.routesRepository.delete(ids);
        return true;
    }
    treeMap(treeArr,id){
        let arr = []
        for(let item of treeArr){
            if(item.id ==id){
                arr.push(item.id)
                return;
            }
            if(item.children && item.children.length>0){
                this.treeMap(item.children,id)
            }
        }
        return arr;
    }
    array2Tree(arr) {
        if (!Array.isArray(arr) || !arr.length) return;
        let map = {};
        arr.forEach(item => (map[item.id] = item));

        let roots = [];
        arr.forEach(item => {
            const parent = map[item.pid];
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                roots.push(item);
            }
        });

        return roots;
    }
}
