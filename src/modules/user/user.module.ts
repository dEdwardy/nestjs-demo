import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity';
import { UserController } from './user.controller'
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from 'nestjs-redis';
import { FriendModule } from '../friend/friend.module';
@Module({
    imports:[
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule),  //forwardRef解决循环依赖 a=>b b=> a
        forwardRef(() => FriendModule),
    ],
    providers: [UserService],
    controllers:[UserController],
    exports:[UserService]
})
export class UserModule {}
