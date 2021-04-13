import { ApiModelProperty } from '@nestjs/swagger';

export class HotelOptions {
  @ApiModelProperty({
    description: '当前页',
    type:'number',
    required: false,
  })
   curPage: number;
  @ApiModelProperty({
    description: '每页条数',
    type:'number',
    required: false,
  })
   pageNum: number;
  @ApiModelProperty({
    description: '查询关键字',
    nullable: true,
    required: false,
  })
  readonly keywords?: string;
}
