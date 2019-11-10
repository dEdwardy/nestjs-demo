import { IsNotEmpty, IsEmail } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger';

export class userDto {
    @ApiModelProperty({ description:'用户名', default: 'Rose'})
    @IsNotEmpty({ message: '请填写用户姓名' })
    readonly username: string;

    @ApiModelProperty({ description:'密码', default: 'Rose'})
    @IsNotEmpty({ message: '请填写密码' })
    readonly password: string;

    @ApiModelProperty({ description:'邮箱'})
    @IsEmail()
    @IsNotEmpty({ message: '请填写邮箱' })
    readonly email: string;
}
export class updatePwdDto {

    @ApiModelProperty({ description:'旧密码' })
    @IsNotEmpty({ message: '请填写旧密码' })
    readonly password: string;

    @ApiModelProperty({ description:'新密码' })
    @IsNotEmpty({ message: '请填写新密码' })
    readonly newPassword: string;

}