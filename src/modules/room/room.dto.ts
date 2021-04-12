import { ApiModelProperty } from '@nestjs/swagger';

export class roomDto {
    @ApiModelProperty({ description:'酒店Id', example: 1})
    readonly hotelId: number;
}   