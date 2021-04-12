
import { ApiModelProperty } from '@nestjs/swagger';

export class PageInfo{
  @ApiModelProperty({
    description:'页数',
  })
  readonly current: number;
}