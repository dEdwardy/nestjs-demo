import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TagDto{
    @ApiModelProperty({ description:'标签名称'})
    readonly name:string;
    
    @ApiModelProperty({ description:'标签别名'})
    readonly alias:string;

}