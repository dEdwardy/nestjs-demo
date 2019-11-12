
import { ApiModelProperty } from '@nestjs/swagger';
import { Category } from '../category/category.entity';
import { Tag } from '../tag/tag.entity';

export class postDto{

    @ApiModelProperty({ description:'标题'})
    readonly title:string;

    @ApiModelProperty({ description:'内容'})
    readonly body:string;

    @ApiModelProperty({ description:'分类'})
    readonly category:Category;

    @ApiModelProperty({ description:'标签'})
    tags: Tag[];
}