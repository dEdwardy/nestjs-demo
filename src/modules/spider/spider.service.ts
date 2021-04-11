import { Injectable,HttpService } from '@nestjs/common';

@Injectable()
export class SpiderService {
    constructor(private readonly httpService:HttpService){}
    private readonly key = '21ee01ea8b514f5b8e1050516d8eb544';
    private readonly baseUrl = 'https://devapi.qweather.com/v7/weather'
    private readonly location = {
        jinjiang:101270116
    }
    getInfoForMe(location = this.location){
         //observale => promise 
         //now   main info
         //obsTime 实况观测时间	               2013-12-30T01:45+08:00
         //temp	   实况温度，默认单位：摄氏度	21
         //feelsLike 实况体感温度，默认单位：摄氏度	  23
         //text	实况天气状况的文字描述，包括阴晴雨雪等天气状态的描述	晴
        return (this.httpService.get('https://devapi.qweather.com/v7/weather/now',{
            params:{
                key: this.key,
                location:location.jinjiang
            }
        })).toPromise()
    }
    getToday(location = this.location){
        return (this.httpService.get('https://devapi.qweather.com/v7/weather/now',{
            params:{
                key: this.key,
                location:location.jinjiang
            }
        })).toPromise()
    }
    get3d(location = this.location){
        return (this.httpService.get('https://devapi.qweather.com/v7/weather/3d',{
            params:{
                key: this.key,
                location:location.jinjiang
            }
        })).toPromise()
    }
    getInfo(url:string){
      return (this.httpService.get(url)).toPromise()
    }
}
