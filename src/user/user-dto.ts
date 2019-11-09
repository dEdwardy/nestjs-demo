import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from 'class-validator'
export class UserDto {
    @ApiModelProperty({
        description:'ID',
        required:false
    })
    id: number;
    @ApiModelProperty({
        description:'姓名'
    })
    @IsNotEmpty({
        message:'请填写姓名'
    })
    name?: string;

}
