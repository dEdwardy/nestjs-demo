import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, ParseIntPipe, Res, Body, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service';
import { FileDto } from './file.dto';
import { Response } from 'express'
import { diskStorage } from 'multer'
import { mkdirP, statP, unlinkP, rmdirP } from '../../utils'
import { encode, decode } from 'iconv-lite'
import { Console } from 'console';
import { writeFile, readFile, fstat, appendFile ,appendFileSync} from 'fs'
import { promisify } from 'util'
const rimraf = require('rimraf')
const writeFileP = promisify(writeFile)
const appendFileP = promisify(appendFile)
const readFileP = promisify(readFile)
@Controller('files')
export class FileController {
    constructor(
        private readonly fileService: FileService
    ) {
    }
    async createDir() {
        try {
            //创建目录成功
            await mkdirP('./uploads/a')
            return true
        } catch (err) {
            if (err.code == 'EXIST') {
                //目录已存在
                return false
            }
        }
    }
    @Post()
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('file'))
    async store(
        @UploadedFile() dto: FileDto,
    ) {
        const res = await this.fileService.store(dto);
        return {
            FileName: res.originalname,
            Url: res.id,
            status: HttpStatus.OK
        }
    }

    /**
     * upload  Intermittent 
     * @param data  
     */
    @Post('v2')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: async (req, file, cb) => {
                try {
                    //创建目录成功
                    await mkdirP('./uploads/' + file.originalname)
                } catch (err) {
                    if (err.code == 'EXIST') {
                        //目录已存在
                    }
                } finally {
                    cb(null, './uploads/' + file.originalname + '/')
                }
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname)
            }
        })
    }))
    async upload(
        @UploadedFile() file,
        @Body() body
    ) {
        //file hash   md5
        let { hash } = body;
        let exist = await this.fileService.find({ hash })
        if (exist) {
            //若存在直接返回 无需走上传
            console.log('exist')
            return 'ok'
        } else {
            console.log('save')
            console.log(file)
            await this.fileService.store({
                ...file,
                hash
            })
        }
    }
    @Get(':id')
    async show(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        const file = await this.fileService.show(id);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${file.filename}`,
        );
        res.sendFile(file.filename, {
            root: 'uploads',
            headers: {
                'Content-type': file.mimetype
            }
        });
    }

    @Post('p1/:slice')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('file'))
    async p1(@UploadedFile() file, @Body() body,@Param('slice') slice) {
        console.log(slice)
        let {  filename, total, current } = body
        try {
            //创建目录成功
            await mkdirP(`./uploads/temp-${filename}`)
        } catch (err) {
            if (err.code == 'EXIST') {
                //目录已存在

            }
        } 
         //判断该切片是否已上传
         statP(`./uploads/temp-${filename}/${slice}`).then(async res => {
            //切片已存在  直接返回ok
            return {
                current,
                total
            }
        }).catch(async e => {
            //切片不存在  
            await writeFileP(`./uploads/temp-${filename}/${slice}`, file.buffer).then(res => res).catch(e => console.log(e))
        })
        return {
            current,
            total
        }
    }
    @Post('p1-merge')
    async merge(@Body() body) {
        let { filename, total } = body
        const run = async () => {
          try {
            for (let i = 0; i < total; i++) {
                let buffer = await readFileP(`./uploads/temp-${filename}/${filename}-${i}`)
                 await appendFileP(`./uploads/${filename}`, buffer)
            }
        rimraf(`./uploads/temp-${filename}`,(err,res) => {
            if(err){
                console.log(err)
            }
            console.log(res)
        })
          } catch (error) {
              console.log(error)
          }
        }
        run()
        return 'ok'
    }
}
