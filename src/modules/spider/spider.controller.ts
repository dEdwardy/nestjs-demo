import { Controller, Get,Response } from '@nestjs/common';
import { SpiderService } from './spider.service';

const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
@Controller('spider')
export class SpiderController {
    constructor(private readonly spiderService:SpiderService){

    }
    @Get('weather')
    async getWeather(){
       let [ res1,res2 ]  = await Promise.all([this.spiderService.getToday(), this.spiderService.get3d()])
        return  {
            'now':res1?.data?.now,
            '3d':res2?.data?.daily
        }
    }
    @Get('p1')
    async getInfo( @Response() res){
      let url = 'https://ncov.dxy.cn/ncovh5/view/pneumonia?from=timeline&isappinstalled=0'
      let { data } =  await this.spiderService.getInfo(url)
      console.log(data.slice(0,1000))
      res.send('0')
    }
    @Get('pup')
    async getInfoByPup(){
      let url = 'https://ncov.dxy.cn/ncovh5/view/pneumonia?from=timeline&isappinstalled=0'
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url)
      const showAll = await page.$('.expandRow___25g3s')
      await showAll.click()
      await page.evaluate(() => {
        let divs = document.querySelectorAll('.areaBlock1___1w9OA')
        for(let item of divs){
          console.log(item)
          let p = [...item.querySelectorAll('p')].map(i=> i.innerText)
          p.forEach(i => console.log(i))
          console.log(p)
        }
      })
      
      await page.waitFor(2500)
    await browser.close()
    } catch (err) {
      console.log(err)
    }
    return 'ok'
    }
}
