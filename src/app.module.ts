import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import  { UserModule } from './user/user.module'
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nestjs',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    UserModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
