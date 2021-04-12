import { Controller, Get, Query, Response } from '@nestjs/common';
import { ApiUseTags, ApiOperation,ApiModelProperty } from '@nestjs/swagger';
import { HotelService } from '../hotel/hotel.service';
import { PageInfo } from './spider.dto';
import { SpiderService } from './spider.service';

const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
@Controller('spider')
@ApiUseTags('Spider')
export class SpiderController {
  constructor(
    private readonly spiderService: SpiderService,
    private readonly hotelService: HotelService
  ) { }
  @Get('weather')
  async getWeather () {
    let [res1, res2] = await Promise.all([this.spiderService.getToday(), this.spiderService.get3d()])
    return {
      'now': res1?.data?.now,
      '3d': res2?.data?.daily
    }
  }
  @Get('p1')
  async getInfo (@Response() res) {
    let url = 'https://ncov.dxy.cn/ncovh5/view/pneumonia?from=timeline&isappinstalled=0'
    let { data } = await this.spiderService.getInfo(url)
    console.log(data.slice(0, 1000))
    res.send('0')
  }
  @Get('pup')
  async getInfoByPup () {
    let url = 'https://ncov.dxy.cn/ncovh5/view/pneumonia?from=timeline&isappinstalled=0'
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url)
      const showAll = await page.$('.expandRow___25g3s')
      await showAll.click()
      await page.evaluate(() => {
        let divs = document.querySelectorAll('.areaBlock1___1w9OA')
        for (let item of divs) {
          console.log(item)
          let p = [...item.querySelectorAll('p')].map(i => i.innerText)
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
  @Get('hotel-infos')
  @ApiOperation({ title:'爬取酒店数据' })
  async getHotelInfos ( @Query() pageInfo:PageInfo) {
    console.log(pageInfo)
    let p = pageInfo.current
    // const store = this.hotelService.store;
    const url = 'http://hotel.elong.com/chengdu/';
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url)
      let data = await page.evaluate(async(p ) => {
        let curPage = document.querySelector('#pageContainer').querySelectorAll('a')[p]
        await curPage.click()
        const arr = []
        const items = document.querySelectorAll('.h_item')
        for (let item of items) {
          const img = item.querySelector('img').getAttribute('big-src')
          console.log(img)
          const name = item.querySelector('.info_cn').textContent
          const location = item.querySelector('.h_info_b2').textContent
          const rate = Number(item.querySelector('.t20.c37e').textContent)
          const tags = [...item.querySelectorAll('.childHotel')].map(i => i.textContent).join(',')
          const desc = item.querySelector('.block.listTagItem').textContent
          arr.push({
            img,
            name,
            location,
            rate,
            tags,
            desc
          })
        }
        return arr
      },p)
      await browser.close()
      console.log(data)
      let  res = await this.hotelService.store(data)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
}

