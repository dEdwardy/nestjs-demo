
import { ApiModelProperty } from '@nestjs/swagger';

export class postDto{

    @ApiModelProperty({ description:'标题',})
    title:string;

    @ApiModelProperty({ description:'内容'})
    body:string;
}