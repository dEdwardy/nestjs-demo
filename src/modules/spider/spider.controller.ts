import { Controller, Get, Query, Response } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiModelProperty } from '@nestjs/swagger';
import { HotelService } from '../hotel/hotel.service';
import { RoomService } from '../room/room.service';
import { PageInfo } from './spider.dto';
import { SpiderService } from './spider.service';

const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
@Controller('spider')
@ApiUseTags('Spider')
export class SpiderController {
  constructor(
    private readonly spiderService: SpiderService,
    private readonly hotelService: HotelService,
    private readonly roomService: RoomService
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
  @ApiOperation({ title: '爬取酒店数据' })
  async getHotelInfos (@Query() pageInfo: PageInfo) {
    let p = pageInfo.current
    const url = 'http://hotel.elong.com/chengdu/';
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url)
      let data = await page.evaluate(async (p) => {
        let curPage = document.querySelector('#pageContainer').querySelectorAll('a')[p]
        await curPage.click()
        const arr = []
        const items = document.querySelectorAll('.h_item')
        for (let item of items) {
          const img = item.querySelector('img').getAttribute('big-src')
          const name = item.querySelector('.info_cn').textContent
          const location = item.querySelector('.h_info_b2').textContent
          const rate = Number(item.querySelector('.t20.c37e').textContent)
          const tags = [...item.querySelectorAll('.childHotel')].map(i => i.textContent).join(',')
          const desc = item.querySelector('.block.listTagItem').textContent
          const id = Number(item.querySelector('.info_cn').getAttribute('data-link').slice(1, -1))
          arr.push({
            img,
            name,
            location,
            rate,
            tags,
            desc,
            id
          })
        }
        return arr
      }, p)
      await browser.close()
      let res = await this.hotelService.store(data)
      return 'ok'
    } catch (err) {
      console.log(err)
    }
  }

  @Get('hotel-detail')
  @ApiOperation({ title: '爬取酒店Room数据' })
  async getHotelRooms () {
    const base = 'https://m.elong.com/hotel/hoteldetail?hotelid=';
    let urls: any = await this.hotelService.getHotelInfo({
      curPage: 1,
      pageNum: 50
    })
    let res = urls[0].filter(i => i.id != 1).map(i => base + i.id)
    for  (let url of res){
        await this.getDetailInfo(url)
    }
    return res
    // let p = pageInfo.current
    // const base = 'http://hotel.elong.com'
    // const url = 'http://hotel.elong.com/chengdu/';
    // try {
    //   const browser = await puppeteer.launch();
    //   const page = await browser.newPage();
    //   await 
    //   await page.goto(url)
    //   let data = await page.evaluate(async(p ) => {
    //     let curPage = document.querySelector('#pageContainer').querySelectorAll('a')[p]
    //     await curPage.click()
    //     const arr = []
    //     const items = document.querySelectorAll('.h_item')
    //     for (let item of items) {
    //       const detail = item.querySelector('.info_cn').getAttribute('data-link')
    //       arr.push(detail)
    //     }
    //     return arr
    //   },p)
    //   for await(item of data){
    //     async() =>{
    //       await page.goto(base+item)
    //       let res = await page.evaluate(() => {
    //         let hotelName = document.querySelector('h1').textContent;

    //         // let roomItems =[... document.querySelectorAll('.htype_item.on')];
    //         // for(let i of roomItems){
    //         // }
    //       })
    //     }();
    //   }
    // } catch (err) {
    //     console.log(err)
    // }
  }
  @Get('hotel-page-1')
  @ApiOperation({ title: '爬取酒店Room page 1' })
  async getDetailInfo (url: string ="https://m.elong.com/hotel/hoteldetail?hotelid=60770917") {
    try {
      const iPhone = puppeteer.devices['iPhone 6'];
      const hotelId = Number(url.split('=')[1])
      console.log(hotelId)
      const browser = await puppeteer.launch({
        headless:true,
      });
      const page = await browser.newPage();
      await page.emulate(iPhone);
      await page.goto(url)
      await page.waitFor(2100)
      const res = await page.evaluate((hotelId) => {
        //list[] name rate price  tags desc img 
        let roomItems = [...document.querySelectorAll('.rooms .r-item')];
        let arr = []
        for (let i of roomItems) {
          let name = i.querySelector('.name').textContent
          let rate = Number((3.5 +Math.random()).toFixed(1))
          let price = 188
          let desc = '......'
          let tags = [...i.querySelectorAll('.txt')].map(i => i.textContent).join(',')
          let img = i.querySelector('img').getAttribute('data-src')
          arr.push({
            hotel:hotelId,
            name,
            rate,
            price,
            desc,
            tags,
            img
          })
        }
        return arr
      },hotelId)
      await browser.close()
      // await this.roomService.store(res)
      return res
    }catch(err){
      console.log(err)
    }
  }
}

