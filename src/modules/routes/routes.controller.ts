import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { routesDto } from './routes.dto';
import { RoutesService } from './routes.service';

@ApiUseTags('routes')
@Controller('api/routes')
export class RoutesController {
    constructor(private readonly routesService:RoutesService){

    }
    @Post()
    addRoute( @Body() data:routesDto){
        return  this.routesService.store(data)
    }
    @Get()
    getRoutes(){
        return  this.routesService.getAll()
    }
    @Get('/tree')
    getTree(){
        return  this.routesService.getRoutesTree()
    }
}
