import { Controller, Post, Body } from '@nestjs/common';
import { categoryDto } from './category.dto';
import { CategoryService } from './category.service';

@Controller('categorys')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ){ }

    @Post()
    async store(@Body() data:categoryDto){
        await this.categoryService.store(data)
    }
}
