import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class categoryDto {

    @ApiModelProperty({ description:'名称'})
    @IsNotEmpty({ message: '请填写分类名称' })
    readonly name:string;

    @ApiModelProperty({ description:'别名'})
    @IsNotEmpty({ message: '请填写分类别名' })
    readonly alias:string;
}