import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult, UpdateResult } from 'typeorm';
import { User as UserEntity } from './user.entity'
import { userDto, updatePwdDto } from './user.dto'
@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userReposity: Repository<UserEntity>) {

    }
    async addUser(dto: userDto): Promise<any> {
        // console.log(dto)
        const { username, password, email } = dto;
        const entity = this.userReposity.create({
            username,
            password,
            email
        })
        return await this.userReposity.save(entity);
    }
    deleteUser(id: string): Promise<DeleteResult> {
        return this.userReposity.delete({ id });
    }
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

    async findByName(username: string, password?:boolean): Promise<any> {
        const queryBuilder = await this.userReposity
            .createQueryBuilder('user');
        queryBuilder
            .where('user.username = :username', { username})

        if(password){
            queryBuilder.leftJoinAndSelect('user.roles','roles')
                .addSelect('user.password')
        }
        const entity = await queryBuilder.getOne();
        return entity;
    }
    async liked(id:string){
        return this.userReposity.findOne(id,{ relations: ['voted','voted.user']})
    }
    async update(id:string, data:userDto){
        const { roles } = data;
        const entity = await this.userReposity.findOne(id);
        if(roles) {
            entity.roles = roles;
        }
        return await this.userReposity.save(entity);
    }
    async possess(
        id:string,
        resource:string,
        resourceId:string 
        ){
         const result = await this.userReposity
            .createQueryBuilder('user')
            .where('user.id= :id',{ id })
            .leftJoin(`user.${resource}`,resource)
            .andWhere(`${resource}.id = :resourceId`, { resourceId })
            .getCount();
        return result ===1 ? true : false;   
    }
}
