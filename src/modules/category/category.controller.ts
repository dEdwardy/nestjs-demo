import { Controller, Post, Body, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { categoryDto } from './category.dto';
import { CategoryService } from './category.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';

@Controller('categorys')
@ApiUseTags('分类')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ){ }

    @Post()
    @ApiOperation({ title: '添加分类' })
    async store(@Body() data:categoryDto){
        return await this.categoryService.store(data)
    }
}
