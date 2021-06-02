import { Body, Controller, Delete, Get, Logger, Post, Put } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { routesDto } from './routes.dto';
import { RoutesService } from './routes.service';
import { CacheService } from '../cache/cache.service'

@ApiUseTags('routes')
@Controller('api/routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService, private readonly cacheService: CacheService) {

  }
  private num = 0;
  private timer = null
  private logger = new Logger()
  @Post()
  addRoute (@Body() data: routesDto) {
    return this.routesService.store(data)
  }
  @Put()
  updateRoute (@Body() data: routesDto) {
    return this.routesService.updateRoute(data)
  }
  @Delete()
  delteRoute (@Body() id: number) {
    return this.routesService.delteRoute(id)
  }

  @Get('/lock')
  async test () {
    let available = await this.cacheService.lock('lock')
    // console.log(available, 'available')
  }
  @Get('/unlock')
  async test2 () {
    let unlock = await this.cacheService.unlock()
  }
  @Get('/init')
  async test3 () {
    let count = await this.cacheService.set('count', 100, 99999999, false)
  }
  @Get('/sell')
  async test4 () {
    let count = await this.cacheService.get('count')
    if (count == 0) {
      this.logger.debug(`sell out......`)
      return
    }
    let available = await this.cacheService.lock('lock')
    if (available) {
      await this.cacheService.set('count', count - 1, 99999999)
      let num = (100 - count +1) +''
      await this.cacheService.sadd('nums',num)
      this.logger.debug(`sell ${100 - count +1 } 件`)
      await this.cacheService.unlock()
    } else {
      // this.logger.debug(`busy...`)
    }
    return {
      available
    }
  }
  @Get()
  async getRoutes () {
    let key = 'api/routes'
    let exp = 2
    let cache = await this.cacheService.get(key, true)
    if (cache) {
      return cache
    }
    let value = await this.routesService.getAll()
    await this.cacheService.unlock();
    this.num++
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null;
    }
    this.timer = setTimeout(() => {
      console.log('缓存一共失效' + this.num + '次')
    })
    await this.cacheService.set(key, value, exp, true)
    return value;
  }
  @Get('/tree')
  getTree () {
    return this.routesService.getRoutesTree()
  }
}
