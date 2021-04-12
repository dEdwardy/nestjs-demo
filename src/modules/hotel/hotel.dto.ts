import { ApiModelProperty } from '@nestjs/swagger';

export class HotelOptions {
  @ApiModelProperty({
    description: '当前页',
    required: false,
  })
  readonly curPage: number;
  @ApiModelProperty({
    description: '每页条数',
    required: false,
  })
  readonly pageNum: number;
  @ApiModelProperty({
    description: '查询关键字',
    nullable: true,
    required: false,
  })
  readonly keywords?: string;
}
