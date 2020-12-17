import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { DemoRolesGuard } from './core/guards/demo-roles.guard';
import { DemoAuthGuard } from './core/guards/demo-auth.guard';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
import { CommentModule } from './modules/comment/comment.module';
import { RoleModule } from './modules/role/role.module';
import { FileModule } from './modules/file/file.module';
import { SocketModule } from './modules/socket/socket.module';
import { FriendModule } from './modules/friend/friend.module';
import { RoutesModule } from './modules/routes/routes.module';
import { CacheModule } from './modules/cache/cache.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.register({
      port: parseInt(process.env.REDIS_PORT, 10),
      host: process.env.HOST,
      password: process.env.PASSWORD,
      db: parseInt(process.env.REDIS_DB_INDEX, 10),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: parseInt(process.env.MYSQL_PORT, 10),
      username: process.env.MYSQL_USERNAME,
      password: process.env.PASSWORD,
      database: process.env.MYSQL_DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PostModule,
    CategoryModule,
    TagModule,
    CommentModule,
    RoleModule,
    // FileModule,
    // SocketModule,
    // FriendModule,
    RoutesModule,
    CacheModule,
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: DemoAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: DemoRolesGuard,
    },
  ],
})
export class AppModule {}
