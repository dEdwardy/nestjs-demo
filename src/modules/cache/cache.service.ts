import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class CacheService {
    private client;
    private lock_key = 'test';
    private whileCount  = 0;
    constructor(private redisService: RedisService) {
        this.getClient();
    }
    async getClient() {
        this.client = await this.redisService.getClient()
    }
    //Set 
    async set(key: string, value: any, seconds: number = 60) {
        value = JSON.stringify(value);
        if (!this.client) {
            await this.getClient()
        }
        // try {
        //     //EX 秒 PX毫秒  NX加锁
        //     let res = await this.client.set(key, value,'EX',seconds,'NX')
        //     console.log(res)
        //     if (res==='OK') {
        //        //success
        //         console.log('ok')
        //         await this.client.set(key, value, 'EX', 60)
        //     } else {
        //          //fail
        //          console.log('busy')
        //     }
        // } catch (error) {
        //     console.error(error)
        // } finally {

        // }
        let lock = await this.lock(key,value,seconds)
        if(lock){
            await this.client.set(key, value, 'EX', seconds)
            await this.client.del(this.lock_key);
        }
    }
    //get
    async get(key: string) {
        if (!this.client) {
            await this.getClient()
        }
        let lock = await this.lock(key)
        if(lock){
            let data = await this.client.get(key)
            if(!data)return
            return JSON.parse(data)
        }else{
            return '系统繁忙'
        }
        
      
       
    }
    async lock(key:string,value:string= '',seconds = 20 ,timeout = 200){
        let res
        if (!this.client) {
            await this.getClient()
        }
        console.log(this.client.clientId)
        try {
            //EX 秒 PX毫秒  NX加锁
            res = await this.client.set(this.lock_key,'3333333333','EX',seconds,'NX')
            console.log(res)
            if (res==='OK') {
                return true
            }else{
                return false
            } 
            
           
        } catch (error) {
            console.error(error)
        } finally {
            
        }
    }
    // //SetNx
    // async setNx(key:string,value:any,seconds?:number){
    //     value = JSON.stringify(value);
    //     if(!this.client){
    //         await this.getClient()
    //     }
    //     if(!seconds){
    //         await this.client.setNX(key,value,'EX')
    //     }else{
    //         await this.client.setNX(key,value,'EX',seconds)
    //     }
    // }
    // //GetNx
    // async getNx(key:string){
    //     if(!this.client){
    //         await this.getClient()
    //     }
    //     let data = await this.client.getNx(key)
    //     if(!data)return
    //     return JSON.parse(data)
    // }
}
