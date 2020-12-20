import { Module, BadRequestException } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity'
import { memoryStorage } from 'multer';

@Module({
  imports:[
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      // dest: './uploads',
      storage:memoryStorage()
      
      // fileFilter:(req,file,callback) => {
      //   const mimetypes = [
      //     'image/png',
      //     'image/jpg'
      //   ];
      //   const allowed = mimetypes.some(type => type === file.mimetype);
      //   if(allowed){
      //     callback(null, true)
      //   }else {
      //     callback(new BadRequestException('不支持上传此类型的文件。'), false)
      //   }
      // }
    })
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}
