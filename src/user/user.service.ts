import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'
@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userReposity: Repository<User>) {

    }
    addUser(user: User): Promise<User> {
        return this.userReposity.save(user);
    }
    deleteUser(user: User): Promise<User> {
        return this.userReposity.remove(user)
    }
    // updateUser(user:User):Promise<User>{
    //     return this.userReposity.update(user.id, user)
    // }
    findAll(): Promise<User[]> {
        return this.userReposity.find();
    }
    findUser(id: string): Promise<User> {
        return this.userReposity.findOne(id)

    }
}
