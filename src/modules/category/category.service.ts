import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { categoryDto } from './category.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository (Category) private readonly categoryRepository:Repository<Category>){

    }
    async store(data:categoryDto){
        const entity = await this.categoryRepository.create(data);
        return await this.categoryRepository.save(entity)
    }
}
