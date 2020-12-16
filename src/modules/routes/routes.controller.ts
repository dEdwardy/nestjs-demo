import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
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
    @Post()
    addRoute(@Body() data: routesDto) {
        return this.routesService.store(data)
    }
    @Put()
    updateRoute(@Body() data: routesDto) {
        return this.routesService.updateRoute(data)
    }
    @Delete()
    delteRoute(@Body() id: number) {
        return this.routesService.delteRoute(id)
    }
    @Get()
    async getRoutes() {
        let key = 'api/routes'
        let exp = 1
        let cache = await this.cacheService.get(key)
        if (cache) {
            return cache
        }
        let value = await this.routesService.getAll()
        this.num++
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null;
        } 
            this.timer = setTimeout(() => {
                console.log('缓存一共失效'+this.num + '次')
            }, 2000)
        await this.cacheService.set(key, value, exp)
        return value;
    }
    @Get('/tree')
    getTree() {
        return this.routesService.getRoutesTree()
    }
}
