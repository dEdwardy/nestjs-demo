import { Injectable } from '@nestjs/common';
import { FileDto } from './file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity'
import { createReadStream } from 'fs';
import { createHash } from 'crypto';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File) 
        private readonly fileRepository: Repository<File>
    ){}
    async store(data){
         return await this.fileRepository.save(data);
    }
    async show(id:string) {
        return await this.fileRepository.findOne(id);
    }
    async find(query:Object){
        return await this.fileRepository.findOne(query)
    }
    async deleteSlices(filename){
        return await this.fileRepository.delete({
            filename,
            originalname:'blob'
        })
    }
    async exist(hash){
        return await this.fileRepository.findOne({hash})
    }
    getMd5(path:string):Promise<string>{
        return new Promise((resolve,reject) => {
            let md5sum = createHash('md5');
            let stream = createReadStream(path)
            stream.on('data', function(chunk) {
                md5sum.update(chunk);
            });
            stream.on('end', function() {
                let str = md5sum.digest('hex').toLowerCase();
                resolve(str)
            });
            stream.on('error', err => {
                reject(err)
            })
        })
    }
    
}
