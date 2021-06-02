import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class CacheService {
  private client;
  private lock_key = 'lock';
  private whileCount = 0;
  constructor(private redisService: RedisService) {
    this.getClient();
  }
  async getClient () {
    this.client = await this.redisService.getClient()
  }
  //Set 
  async set (key: string, value: any, seconds: number = 60, needLock = false) {
    if (typeof value !== 'string') value = JSON.stringify(value);
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
    if (needLock) {
      let lock = await this.lock(key, value, seconds)
      if (lock) {
        await this.client.set(key, value, 'EX', seconds)
        await this.client.del(this.lock_key);
      }
    } else {
      await this.client.set(key, value, 'EX', seconds)
    }

  }
  //get
  async get (key: string, needLock = false) {
    if (!this.client) {
      await this.getClient()
    }
    if (!needLock) {
      return await this.client.get(key)
    }
    let data = await this.client.get(key)
    if (!data) {
      //缓存若不存在 则 加锁 走db
      let lock = await this.lock(key)
      if (lock) {
        //查mysql
        return 'lock'
      } else {
        // let ttl = await this.client.ttl(this.lock_key)
        // if(ttl<0){
        //     //若锁过期
        // }
        return '系统繁忙'
      }
    }
    return JSON.parse(data)
  }
  async getTTL (key: string) {
    if (!this.client) {
      await this.getClient()
    }
    return this.client.ttl(key)
  }
  //去锁 del
  async unlock () {
    if (!this.client) await this.getClient()
    return await this.client.del(this.lock_key);
  }
  //加锁  setnx
  async lock (key: string, value: string = '', seconds = 9999999, timeout = 200) {
    let res
    if (!this.client) {
      await this.getClient()
    }
    try {
      //EX 秒 PX毫秒  NX加锁
      res = await this.client.set(this.lock_key, 100, 'EX', seconds, 'NX')
      // console.log(res)
      if (res === 'OK') {
        // console.log('ok')
        return true
      } else {
        // console.log('not ok locked ')
        return false
      }

    } catch (error) {
      // console.error(error)
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

  //redis sadd
  async sadd (key: string, payload: string) {
    if (!this.client) {
      await this.getClient()
    }
    return this.client.sadd(key, payload)
  }
  //redis srem
  async srem (key: string, payload: string) {
    if (!this.client) {
      await this.getClient()
    }
    return this.client.srem(key, payload)
  }
}
