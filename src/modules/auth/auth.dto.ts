
import {  ApiModelProperty } from '@nestjs/swagger';
export class LoginDto {

    @ApiModelProperty({ description:'用户名'})
    readonly username:string;

    @ApiModelProperty({ description:'密码'})
    readonly password:string;
}

export class AppLoginDto {

  @ApiModelProperty({ description:'邮件'})
  readonly email:string;

  @ApiModelProperty({ description:'验证码'})
  readonly code:string;
}