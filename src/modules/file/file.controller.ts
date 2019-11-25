import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, ParseIntPipe, Res, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service';
import { FileDto } from './file.dto';
import { Response} from 'express'
import { join, resolve } from 'path'

@Controller('files')
export class FileController {
    constructor(
        private readonly fileService:FileService
    ){}
    @Post()
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('file'))
    async store(
        @UploadedFile() dto:FileDto,
    ){
        const res =await this.fileService.store(dto);
        return {
            FileName:res.originalname,
            Url:res.id,
            status:HttpStatus.OK
        }
    }
    @Get(':id')
    async show(
        @Param('id') id:string,
        @Res() res: Response
    ) {
        const file = await this.fileService.show(id);
        res.sendFile(file.filename,{
            root:'uploads',
            headers:{
                'Content-type':file.mimetype
            }
        })
    }
}
