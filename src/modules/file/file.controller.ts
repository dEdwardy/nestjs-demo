import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  ParseIntPipe,
  Res,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { FileDto } from './file.dto';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { mkdirP, statP, unlinkP, rmdirP } from '../../utils';
import {
  writeFile,
  readFile,
  fstat,
  appendFile,
  appendFileSync,
  createReadStream,
  createWriteStream,
} from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';
const rimraf = require('rimraf');
const writeFileP = promisify(writeFile);
const appendFileP = promisify(appendFile);
const readFileP = promisify(readFile);
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }
  async createDir() {
    try {
      //创建目录成功
      await mkdirP('./uploads/a');
      return true;
    } catch (err) {
      if (err.code == 'EXIST') {
        //目录已存在
        return false;
      }
    }
  }
  /**
   * upload  Intermittent 基于multer
   * @param data
   */
  @Post('p2/:slice')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          // console.log(file)
          let arr = req.url.split('/');
          let slice = arr[arr.length - 1];
          let folederName = slice.split('-')[0];
          try {
            //创建目录成功
            await mkdirP('./uploads/temp-' + folederName);
          } catch (err) {
            if (err.code == 'EXIST') {
              //目录已存在
            }
          } finally {
            console.log('finally' + slice)
            cb(null, './uploads/temp-' + folederName + '/');
          }
        },
        filename: (req, file, cb) => {
          let arr = req.url.split('/');
          let slice = arr[arr.length - 1];
          cb(null, slice);
        },
      }),  
      limits: {
        fieldSize: 1024 * 1024 * 200
      }
    }),
  )
  async upload(@UploadedFile() file, @Param('slice') slice, @Body() body) {
    console.log(slice);
    console.log(slice);
    return 'ok';
  }

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async store(@UploadedFile() dto: FileDto) {
    console.log(dto)
    const res = await this.fileService.store(dto);
    return {
      FileName: res.originalname,
      Url: res.id,
      status: HttpStatus.OK,
    };
  }

  // @Get(':id')
  // async show(@Param('id') id: string, @Res() res: Response) {
  //   const file = await this.fileService.show(id);
  //   res.setHeader('Content-Type', 'application/octet-stream');
  //   res.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename=${file.filename}`,
  //   );
  //   res.sendFile(file.filename, {
  //     root: 'uploads',
  //     headers: {
  //       'Content-type': file.mimetype,
  //     },
  //   });
  // }
  /**
   * 判断文件是否存在  若存在则直接返回
   * @param body 
   */
  @Post('p1-exist')
  @HttpCode(HttpStatus.OK)
  async exist(@Body() body) { 
    let { hash } = body;
    return await this.fileService.exist(hash)
  }

  //自定义文件读写
  @Post('p1/:slice')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async p1(@UploadedFile() file, @Body() body, @Param('slice') slice) {
    // console.log(slice);
    let { filename, total, current, hash } = body;
    try {
      //创建目录成功
      await mkdirP(`./uploads/temp-${filename}`);
    } catch (err) {
      if (err.code == 'EXIST') {
        //目录已存在
      }
    }
    //判断该切片是否已上传
    // statP(`./uploads/temp-${filename}/${slice}`)
    this.fileService.exist(hash)
      .then(async res => {
        if (res) {
          //切片已存在  直接返回ok
          return {
            current: current,
            total,
          };
        } else {
          //切片不存在
          await writeFileP(`./uploads/temp-${filename}/${slice}`, file.buffer)
            .then(() => {
              this.fileService.store({
                ...file,
                hash,
                filename
              })
            })
            .catch(e => console.log(e));
        }
      })
      .catch(e => {
        console.log(e)
      });
    return {
      current,
      total,
    };
  }
  //:TODO merge 太慢了  后续以streanm处理
  @Post('p1-merge')
  @UseInterceptors(FileInterceptor('file'))
  async merge(@UploadedFile() file, @Body() body) {
    let { filename, total } = body;
    // console.log(filename);
    let read = (path) => readFileP(path)
    let append = (path,buffer) => appendFileP(path,buffer)
    const run = async () => {
      try {
        for (let i = 0; i < total; i++) {
          // let buffer = await readFileP(
          //   `./uploads/temp-${filename}/${filename}-${i}`,
          // );
          // await appendFileP(`./uploads/${filename}`, buffer);
          let buffer = await read(`./uploads/temp-${filename}/${filename}-${i}`);
          await append(`./uploads/${filename}`,buffer)
        }
      } catch (error) {
        console.log('2222222222222222222');
        console.log(error);
      }
      let md5 = await this.fileService.getMd5(resolve(__dirname, '../../../uploads/', filename))
      console.log(md5)
      await this.fileService.store({
        ...file,
        filename,
        hash: md5
      })
      rimraf(`./uploads/temp-${filename}`, (err, res) => {
        if (err) {
          console.log('11111111111111111');
          console.log(err);
        } else {
          this.fileService.deleteSlices(filename)
        }
      });
    };
    run();
    return {
      current: total,
      total,
    };
  }
  @Get('p1-md5')
  md5() {
    let path = resolve(__dirname, '../../../uploads/', 'pkg_main_heliaircrafts.grp')
    return this.fileService.getMd5(path)
  }
  save(buffer: Buffer, path: string) {
    let p = new Promise((resolve, reject) => {
      let writeStream = createWriteStream(path, 'utf8');
      writeStream.write(buffer);
      resolve(true);
    });
    p.catch(e => {
      Promise.reject(false);
    });
    return p;
  }
}
