import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import  { UserModule } from './modules/user/user.module'
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { DemoRolesGuard } from './core/guards/demo-roles.guard';
import { DemoAuthGuard } from './core/guards/demo-auth.guard';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
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
    UserModule,
    AuthModule,
    PostModule,
    CategoryModule,
    TagModule
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide:APP_GUARD,
      useClass: DemoAuthGuard
    },
    {
      provide:APP_GUARD,
      useClass: DemoRolesGuard
    }
  ],
})
export class AppModule {}
