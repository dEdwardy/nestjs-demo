import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult, UpdateResult } from 'typeorm';
import { User as UserEntity } from './user.entity'
import { userDto, updatePwdDto } from './user.dto'
import { User as UserRo } from './user.interface'
@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userReposity: Repository<UserEntity>) {

    }
    async addUser(dto: userDto): Promise<any> {
        const { username, password, email } = dto;
        let user = new UserEntity();
        user.username = username;
        user.password = password;
        user.email = email;
        return await this.userReposity.save(user);
    }
    deleteUser(id: string): Promise<DeleteResult> {
        return this.userReposity.delete({ id });
    }
    // async updateUser(id: string, dto: Partial<userDto>): Promise<UpdateResult> {

    //     let user = new UserEntity();
    //     user.username = dto.username;
    //     user.password = dto.password;
    //     user.email = dto.email;
    //     return await this.userReposity.update(user, { id })
    // }
    async updatePwd(id:string, data:updatePwdDto){
        const { password, newPassword } = data;
        const entity = await this.userReposity.findOne(id);

        if(!entity){
            throw new NotFoundException('未找到用户。');
        }
        const pass = await entity.comparePwd(password);
        if(!pass){
            throw new BadRequestException('密码验证失败，请重新输入正确的密码。');
        } 
        entity.password = newPassword;
        return this.userReposity.save(entity)


    }
    findAll(): Promise<UserEntity[]> {
        return this.userReposity.find({ relations: ['posts'] });
    }
    async findOne(dto: userDto): Promise<UserEntity> {
        const findOneOptions = {
            email: dto.email,
            password: dto.password
        };
        return await this.userReposity.findOne(findOneOptions, { relations:['posts'] });
    }
    findUserById(id: string): Promise<UserEntity> {
        return this.userReposity.findOne(id)
    }
    async findByEmail(email: string): Promise<any> {
        return await this.userReposity.findOne({ email: email });
    }

    async findByName(username: string): Promise<any> {
        return await this.userReposity.findOne({ username });
    }

}
